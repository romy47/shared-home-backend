import { HouseMemberApprovalState, PrismaClient, Role } from '@prisma/client';
import { BadRequestError, NotFoundError } from './api-error';
import { AuthRepository } from './auth-repository';


export class UserRepository {
  private prisma: PrismaClient;
  private authRepository:AuthRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.authRepository=new AuthRepository();
  }

  // Search for a user by username
  findUserByUsername = async (username: string) => {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: username,   // This will match any username that contains the input string.
          mode: 'insensitive'   // This makes the search case-insensitive.
        }
      }
    });
  }
  findUserById=async (id: number)=> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  



  // Utility method to get house_user_ref by querying the HouseUser table
   getHouseUser=async(userId: number, houseId: number)=> {
    return this.prisma.houseUser.findFirst({
      where: { user_id: userId, house_id: houseId },
    });
  }
}
