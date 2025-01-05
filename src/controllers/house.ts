import { Response } from "express";
import IRequest from "../models/request";
import { CreatedResponse, SuccessResponse } from "../models/api-response";
import {   NotFoundError } from "../models/api-error";
import { HouseDetails, HouseListQueryResult } from "../types/house.types";
import { HouseRepository } from "../models/house-repository";
import { UserRoleRepository } from "../models/user.role.repository";

export class HouseController {
  private houseRepo: HouseRepository;
  private userRoleRepo:UserRoleRepository;

  constructor() {
    this.houseRepo = new HouseRepository();
    this.userRoleRepo = new UserRoleRepository();
  }

  createHouse=async(req: IRequest, res: Response)=> {
    const { title, profile_img } = req.body;
    const created_by = req.user.id; // Assuming `user` has an `id` field
  

    
      // Start a transaction
      const result = await this.houseRepo.getPrismaClient().$transaction(async (prisma) => {
        // Create the House
        const newHouse = await this.houseRepo.createHouse({
            title,
            profile_img,
            created_by,
          }
        );
  
        // Find the ADMIN role
        const adminRole = await this.userRoleRepo.findRoleByRoleName('ADMIN');
  
        if (!adminRole) {
          throw new NotFoundError('Cannot create house, user doesn’t have privilege');
        }
  
        // Create a HouseUser with the ADMIN role
        await this.houseRepo.createHouseUser({
          house_id: newHouse.id,
          user_id: created_by,
          role_id: adminRole.id,
        })
        
  
        const newHouseDetails = await this.houseRepo.getHouseDetails(newHouse.id);
  
        // Return the new house as part of the transaction result
        return newHouseDetails;
      });
  
      // If transaction is successful, return the response
      new CreatedResponse('Created', result).send(res);
    
  }

   updateHouse=async(req: IRequest, res: Response)=> {
    const { id } = req.params;
    const { title, profile_img } = req.body;
  
   
      const house = await this.houseRepo.getMyHouseElseThrow(id, req.user.id);
  
      // Now update the house
      await this.houseRepo.updateHouse(house.id, { title, profile_img });
      const updatedHouseDetails:HouseDetails = await this.houseRepo.getHouseDetails(house.id);
      
      new SuccessResponse('Success', updatedHouseDetails).send(res);
  }

  deleteHouse=async(req: IRequest, res: Response)=> {
    const { id } = req.params;

    const house = await this.houseRepo.getMyHouseElseThrow(id, req.user.id);
  
    // Now update the house
    await this.houseRepo.updateHouse(house.id, { deleted:true });
    const softDeletedHouse = await this.houseRepo.getHouseDetails(house.id);
      
    new SuccessResponse('Success', softDeletedHouse).send(res);
  }

  getHouseDetails= async (req: IRequest, res: Response)=> {
    console.log('comin g here..................')
    const { id } = req.params;
    await this.houseRepo.getMyHouseElseThrow(id,req.user.id);//to check ownership and house existance
    const houseDetails:HouseDetails = await this.houseRepo.getHouseDetails(parseInt(id!));
    new SuccessResponse('Success', houseDetails).send(res);
    
  }

  getMyHouses= async (req: IRequest, res: Response)=> {
    const houses= await this.houseRepo.getAllHousesByUser(req.user.id);
    new SuccessResponse('Success', houses).send(res);
  }

}
