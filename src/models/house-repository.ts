import { House, HouseMemberApprovalState, PrismaClient, Role } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError } from './api-error';
import { HouseDetails } from '../types/house.types';
import { UserRepository } from './user-repository';
import { UserRoleRepository } from './user.role.repository';


export class HouseRepository {
    private prisma: PrismaClient;
    private userRepository:UserRepository;
    private userRoleRepository:UserRoleRepository;

    constructor() {
        this.prisma = new PrismaClient();
        this.userRepository = new UserRepository()
        this.userRoleRepository = new UserRoleRepository();
    }
   createHouse=async (data: { title: string; profile_img: string; created_by: number })=> {
    return this.prisma.house.create({
      data,
    });
  }

   getAllHousesByUser=async(userId: number)=> {
   
    return this.prisma.house.findMany({
      where: {
        created_by: userId, // Only houses created by the user
      },
      select: {
        id: true,
        title: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        createdBy: {  // Explicitly select fields for the 'createdBy' relation
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            
          },
        },
        houseImage: {  // Explicitly select fields for the 'houseImage' relation
          select: {
            id: true,
            icon_name: true,
            image_path: true,
          },
        },
      }
    });
  }


  
   createHouseUser=async(data: { house_id: number; user_id: number; role_id: number })=> {
    return this.prisma.houseUser.create({
      data,
    });
  }
    // Add a house member
    addHouseMember=async(id: number, houseId: number, houseUserRefId: number, role: string)=> {
      const user = await this.userRepository.findUserById(id);
  
      if (!user) {
        throw new NotFoundError('User not found');
      }
  
      const state = role === 'ADMIN' ? HouseMemberApprovalState.approved : HouseMemberApprovalState.pending; 
  
      const houseMemberRequest = await this.prisma.houseMemberRequest.create({
        data: {
          house_id: houseId,
          user_id: user.id,
          house_user_ref_id: houseUserRefId,
          state,
        },
      });
  
      if (role === 'ADMIN') {
        const tenantRole:Role|null = await this.userRoleRepo.findRoleByRoleName('TENANT');
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
