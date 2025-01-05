import { House, HouseMemberApprovalState, HouseUser, PrismaClient, Role } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError } from './api-error';
import { HouseCreationPayload, HouseDetails, HouseUserWithRole, HouseWithImgAndCreatedBy } from '../types/house.types';
import { UserRepository } from './user-repository';
import { AuthRepository } from './auth-repository';



export class HouseRepository {
    private prisma: PrismaClient;
    private userRepository:UserRepository;
    private authRepository:AuthRepository;

    constructor() {
        this.prisma = new PrismaClient();
        this.userRepository = new UserRepository()
        this.authRepository = new AuthRepository()
    }
   createHouse=async (data: HouseCreationPayload)=> {
    return this.prisma.house.create({
      data,
    });
  }
    getHouseUserWithRoleByHouseAndUser = async (houseId:number, userId:number):Promise<HouseUserWithRole>=> {
      const houseUser:HouseUserWithRole|null = await this.prisma.houseUser.findUnique({
        where: {
          house_id_user_id: { //because it was composite key
            house_id: houseId,
            user_id: userId,
          },
        },
        include: {
          role: true, // This will include the associated role in the result, we need that
        },
      });
      if(!houseUser)
        throw new NotFoundError('house user is not found, meaning user is not a member of this house')
      return houseUser
    }

   getAllHousesByUser=async(userId: number):Promise<HouseWithImgAndCreatedBy[]>=> {
   
    const houseList:HouseWithImgAndCreatedBy[]=  await this.prisma.house.findMany({
      where: {
        OR: [
          { created_by: userId }, // Houses that are created by this user
          { houseMembers: { some: { user_id: userId } } } // Houses where the user is a member
        ]
      },
      select: {
        id: true,
        title: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        createdBy: true,
        houseImage: true
      }
    });
    return houseList;
  }


  
   createHouseUser=async(data: { house_id: number; user_id: number; role_id: number })=> {
    return this.prisma.houseUser.create({
      data,
    });
  }
    // Add a house member
    addHouseMember=async(userId: number, requestUserId:number, houseId: number)=> {
      const user = await this.userRepository.findUserById(userId);
      //houseUser of currently logged in user
      const houseUser = await this.getHouseUserWithRoleByHouseAndUser(houseId,requestUserId);
  
      if (!user) {
        throw new NotFoundError('User not found');
      }
  
      //if admin is adding someone, we will approve immediately, but still add a member request with state approved
      const state = houseUser.role.role === 'ADMIN' ? HouseMemberApprovalState.approved : HouseMemberApprovalState.pending; 
  
      const houseMemberRequest = await this.prisma.houseMemberRequest.create({
        data: {
          house_id: houseId,
          user_id: user.id,
          house_user_ref_id: houseUser.id,
          state,
        },
      });
  
      //if the role of the request user was admin then immediately add the new user as housemember
      //as well
      if (houseUser.role.role === 'ADMIN') {
        const tenantRole:Role|null = await this.authRepository.findRoleByRoleName('TENANT');
        if(!tenantRole){
          throw new BadRequestError('tennat role does not exist')
        }
        await this.prisma.houseUser.create({
          data: {
            house_id: houseId,
            user_id: user.id,
            role_id: tenantRole.id, // Assuming a role_id for house member
          },
        });
      }
  
      return houseMemberRequest;
    }

   getHouseDetails=async(id: number)=> {
    const houseDetails:HouseDetails|null = await this.prisma.house.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        house_img: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        createdBy: true,
        houseMembers: {
          select: {
            house_id: true,
            user: true,
            role: true,
            
          },
        },
      },
    });

    if (!houseDetails) {
      throw new NotFoundError('House not found');
    }
    return houseDetails;
  }

  getHouseMemberRequestById = async (requestId:number)=>{
    const houseMemberRequest = await this.prisma.houseMemberRequest.findUnique({
      where: { id: requestId },
    });
    return houseMemberRequest
  }
  updateHouseMemberRequestState = async (requestId:number, action:HouseMemberApprovalState)=>{
    const updatedHouseMemberRequest = await this.prisma.houseMemberRequest.update({
      where: { id: requestId },
      data: { state: HouseMemberApprovalState.approved },
    });
    return updatedHouseMemberRequest
  }
  approveOrDenyHouseMemberRequest = async (
    houseMemberRequestId: number, 
    action: HouseMemberApprovalState, 
    approverUserId: number
  ) => {

    // Find the house member request by ID
    const houseMemberRequest = await this.getHouseMemberRequestById(houseMemberRequestId);
  
    if (!houseMemberRequest) {
      throw new NotFoundError('House member request not found');
    }
  
    if (houseMemberRequest.state === HouseMemberApprovalState.approved) {
      return houseMemberRequest;
    }

    // Check if the approver is an admin for the house
    const approverHouseUser = await this.getHouseUserWithRoleByHouseAndUser(houseMemberRequest.house_id,approverUserId);
    if(approverHouseUser.role.role !== 'ADMIN')
      throw new ForbiddenError('Only an admin can approve or deny requests');
    
  
    if (action === HouseMemberApprovalState.approved) {
      // Check if a house member already exists with the same user_id and house_id
      const existingHouseMember = await this.prisma.houseUser.findFirst({
        where: {
          user_id: houseMemberRequest.user_id,
          house_id: houseMemberRequest.house_id,
        },
      });
  
      if (existingHouseMember) {
        throw new BadRequestError('House member already exists');
      }
  
      // Update the house member request as approved
      const updatedHouseMemberRequest = await this.updateHouseMemberRequestState(houseMemberRequestId,action)
  

      // Create a new house member
      const tenantRole:Role|null = await this.authRepository.findRoleByRoleName('TENANT');
      if(!tenantRole){
        throw new NotFoundError('tenant role not found')
      }
      await this.prisma.houseUser.create({
        data: {
          house_id: houseMemberRequest.house_id,
          user_id: houseMemberRequest.user_id,
          role_id: tenantRole.id, // Assuming role_id is in the request
        },
      });
  
      return updatedHouseMemberRequest;
    } else if (action === HouseMemberApprovalState.rejected) {
      // Update the house member request as denied
      const updatedHouseMemberRequest = await this.prisma.houseMemberRequest.update({
        where: { id: houseMemberRequestId },
        data: { state: HouseMemberApprovalState.rejected },
      });
  
      return updatedHouseMemberRequest;
    } else {
      throw new BadRequestError('Invalid action');
    }
  };
  
  

   findHouseById=async(id: number)=> {
    if(id){
      return this.prisma.house.findUnique({
        where: { id:id },
      });
    }
    
  }

  updateHouse = async (id: number, data: { title?: string; profile_img?: string, deleted?: boolean }) => {
    return this.prisma.house.update({
      where: { id },
      data:data
    });
  };

    getMyHouseElseThrow=async(id:string|undefined, request_user_id:number):Promise<House>=> {
    if (!id) {
      throw new BadRequestError('House ID is not provided');
    }
  
    const house:House|undefined|null = await this.findHouseById(parseInt(id));
  
    if (!house) {
      throw new NotFoundError('House not found');
    }
  
    if (house.created_by !== request_user_id) {
      throw new ForbiddenError('You are not authorized to update this house');
    }
    return house;
  
  }
  getPrismaClient(){
    return this.prisma;
  }
}
