import { ImageLibrary, Role, User } from "@prisma/client";
import { Timestamps } from "./common-types";

export type HouseDetails = Timestamps & {
    id: number;
    title: string| null;
    house_img: number | null;
    deleted: boolean;
    createdBy: User;
    houseMembers: HouseMember[];
};

export  type HouseMember = {
    house_id: number;
    user: User;
    role: Role;
  };

export  type HouseListQueryResult = {
    id: number;
    title: string | null;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
    createdBy: User; // Using the User type for the createdBy relation
    houseImage: ImageLibrary | null; // Using the ImageLibrary type for the houseImage relation
};