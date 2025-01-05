import { Response } from "express";
import IRequest from "../models/request";
import { CreatedResponse, SuccessResponse } from "../models/api-response";
import {   NotFoundError, UnprocessableEntityError } from "../models/api-error";
import { HouseDetails } from "../types/house.types";
import { HouseRepository } from "../models/house-repository";
import { AuthRepository } from "../models/auth-repository";
import { HouseMemberApprovalState } from "@prisma/client";
import { commonRepository } from "../models/common-repository";


export class HouseController {
  private houseRepo: HouseRepository;
  private authRepo: AuthRepository;
  

  constructor() {
    this.houseRepo = new HouseRepository();
    this.authRepo = new AuthRepository();
  }

  createHouse=async(req: IRequest, res: Response)=> {
    const { title, image_url } = req.body;
    const created_by = req.user.id; // Assuming `user` has an `id` field
  

    
      // Start a transaction
      const result = await this.houseRepo.getPrismaClient().$transaction(async (prisma) => {

        const imageObject = await commonRepository.createImageResource(image_url);
        // Create the House
        const newHouse = await this.houseRepo.createHouse({
            title,
            house_img:imageObject.id,
            created_by,
          }
        );
  
        // Find the ADMIN role
        const adminRole = await this.authRepo.findRoleByRoleName('ADMIN');
  
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
    //TODO need to do much more like deleting many association things later
    await this.houseRepo.updateHouse(house.id, { deleted:true });
    const softDeletedHouse = await this.houseRepo.getHouseDetails(house.id);
      
    new SuccessResponse('Success', softDeletedHouse).send(res);
  }

  getHouseDetails= async (req: IRequest, res: Response)=> {
    const { id } = req.params;
    await this.houseRepo.getMyHouseElseThrow(id,req.user.id);//to check ownership and house existance
    const houseDetails:HouseDetails = await this.houseRepo.getHouseDetails(parseInt(id!));
    new SuccessResponse('Success', houseDetails).send(res);
    
  }

  getMyHouses= async (req: IRequest, res: Response)=> {
    const houses= await this.houseRepo.getAllHousesByUser(req.user.id);
    new SuccessResponse('Success', houses).send(res);
  }

  addHouseMember=async(req: IRequest, res: Response)=> {
    const { houseId, userId, } = req.body;
    const houseMemberRequest = await this.houseRepo.addHouseMember(userId, req.user.id, houseId);
    new SuccessResponse('Success', houseMemberRequest).send(res);
  }

  approveOrDenyMemberRequest = async(req: IRequest, res: Response)=> {
    const {requestId} = req.params;
    const { action} = req.body;
    if(!requestId){
      throw new UnprocessableEntityError('a valid member request id must be passed')
    }
    if(!action || action!== HouseMemberApprovalState.approved || action!==HouseMemberApprovalState.rejected){
      throw new UnprocessableEntityError('action is invalid, must provide accept or reject')
    }
    const updatedMemberRequest = this.houseRepo.approveOrDenyHouseMemberRequest(parseInt(requestId),action, req.user.id);
    new SuccessResponse('Success', updatedMemberRequest).send(res);
  }

}
