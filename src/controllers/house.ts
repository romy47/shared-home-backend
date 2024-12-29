import { Response } from "express";
import IRequest from "../models/request";
import { CreatedResponse, SuccessResponse } from "../models/api-response";
import { House, PrismaClient } from "@prisma/client";
import { BadRequestError, ForbiddenError, InternalError, NotFoundError } from "../models/api-error";
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
        throw new NotFoundError('Cannot create house, user doesn’t have privilege');
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
    new CreatedResponse('Created', { data: result }).send(res);
  } catch (error) {
    // If any error occurs, transaction is automatically rolled back
    console.error(error);

    // Throw a new InternalError with a custom message
    throw new InternalError('Internal Server Error when creating house');
  }
}

  

async function updateHouse(req: IRequest, res: Response) {
  const { id } = req.params;
  const { title, profile_img } = req.body;

  try {
    const house = await getMyHouseElseThrow(id, req.user.id);

    // Now update the house
    const updatedHouse = await prisma.house.update({
      where: {
        id: house.id,
      },
      data: {
        ...(title && { title }),
        ...(profile_img && { profile_img }),
      },
    });

    new SuccessResponse('Success', { data: updatedHouse }).send(res);
  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2025') { //TODO check if this really works this way
      // Handle cases where the update fails (e.g., house not found)
      throw new ForbiddenError('You are not authorized to update this house');
    }

    // General error handling
    throw new InternalError('Internal Server Error when updating house');
  }
}

async function getHouseDetails(req: IRequest, res: Response) {
  const { id } = req.params;

  await getMyHouseElseThrow(id,req.user.id);//to check ownership and house existance

  try {
    // Fetch the house with creator and house users
    const houseDetails = await prisma.house.findUnique({
      where: {
        id: parseInt(id!),
      },
      select: {
        id: true,
        title: true,
        profile_img: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        createdBy: true, // Include the related user
        houseMembers: {
          include: {
            user: true, // Include the user related to each houseMember
            role: true
          },
        },
      },
    });

    if (!houseDetails) {
      throw new NotFoundError('House not found');
    }

    // Send the response with house details, creator and house users with roles
    new SuccessResponse('Success', {
      house: houseDetails
    }).send(res);
  } catch (error: any) {
    console.error(error);
    throw new InternalError('Internal Server Error while fetching house details');
  }
}

async function getMyHouseElseThrow(id:string|undefined, request_user_id:number):Promise<House> {
  if (!id) {
    throw new BadRequestError('House ID is not provided');
  }

  const house = await prisma.house.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!house) {
    throw new NotFoundError('House not found');
  }

  if (house.created_by !== request_user_id) {
    throw new ForbiddenError('You are not authorized to update this house');
  }
  return house;

}


export {createHouse, updateHouse, getHouseDetails}