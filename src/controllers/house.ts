import { Response } from "express";
import IRequest from "../models/request";
import { BadRequestResponse, CreatedResponse, ForbiddenResponse, InternalErrorResponse, NotFoundResponse, SuccessResponse } from "../models/api-response";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function createHouse(req: IRequest, res: Response) {
    const { title, profile_img } = req.body;
    const created_by = req.user.id; // Assuming `user` has an `id` field
    
    const prisma = new PrismaClient();
  
    try {
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create the House
        const newHouse = await prisma.house.create({
          data: {
            title,
            profile_img,
            created_by,
          },
        });
  
        // Find the ADMIN role
        const adminRole = await prisma.role.findFirst({
          where: { role: 'ADMIN' },
        });
  
        if (!adminRole) {
            new NotFoundResponse("Not found", { error: 'Cannot create house, user dont have priviledge' }).send(res);
            return;
        }
  
        // Create a HouseUser with the ADMIN role
        await prisma.houseUser.create({
          data: {
            house_id: newHouse.id,
            user_id: created_by,
            role_id: adminRole.id,
          },
        });
  
        // Return the new house as part of the transaction result
        return newHouse;
      });
  
      // If transaction is successful, return the response
      new CreatedResponse("Created", { data: result }).send(res);
    } catch (error) {
      // If any error occurs, transaction is automatically rolled back
      console.error(error);
  
      // Return a custom error response
      new InternalErrorResponse("InternalError", {
        error: 'Internal Server Error when creating house',
      }).send(res);
    }
  }
  

  async function updateHouse(req: IRequest, res: Response) {
    const { id } = req.params;
    const { title, profile_img } = req.body;
  
    if (!id) {
      new BadRequestResponse("Bad Request", { error: 'House ID is not provided' }).send(res);
      return;
    }
  
    try {
        const house = await prisma.house.findUnique({
            where: {
              id: parseInt(id),
            },
          });
      
          if (!house) {
            new NotFoundResponse("Not Found", { error: "House not found" }).send(res);
            return;
          }
      
          if (house.created_by !== req.user.id) {
            new ForbiddenResponse("Forbidden", { error: "You are not authorized to update this house" }).send(res);
            return;
          }
      
          // Now update the house
          const updatedHouse = await prisma.house.update({
            where: {
              id: parseInt(id),
            },
            data: {
              ...(title && { title }),
              ...(profile_img && { profile_img }),
            },
          });
          new SuccessResponse("Success", { data: updatedHouse }).send(res);
    } catch (error:any) {
      console.error(error);
      // Handle cases where the update fails (e.g., house not found, not authorized)
      if (error.code === 'P2025') {
        return new ForbiddenResponse("Forbidden", { error: "You are not authorized to update this house" }).send(res);
      } else {
        return new InternalErrorResponse("InternalError", { error: 'Internal Server Error when updating house' }).send(res);
      }
    }
}
async function getHouseDetails(req: IRequest, res: Response) {
  const { id } = req.params;

  if (!id) {
    new BadRequestResponse("Bad Request", { error: 'House ID is not provided' }).send(res);
    return;
  }

  try {
    // Fetch the house with creator and house users
    const houseDetails = await prisma.house.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        createdBy: true, // Include the creator's user object
        users: {
          include: {
            user: true,  // Include user object for house users
            role: true,  // Include role object for house users
          },
        },
      },
    });

    if (!houseDetails) {
      new NotFoundResponse("Not Found", { error: "House not found" }).send(res);
      return;
    }

    // Send the response with house details, creator and house users with roles
    new SuccessResponse("Success", {
      house: houseDetails,
      createdBy: houseDetails.createdBy,
      houseUsers: houseDetails.users,
    }).send(res);
  } catch (error: any) {
    console.error(error);
    new InternalErrorResponse("InternalError", { error: 'Internal Server Error while fetching house details' }).send(res);
  }
}


export {createHouse, updateHouse, getHouseDetails}