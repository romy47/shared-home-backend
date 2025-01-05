import { Timestamps } from "./common-types";

export type User = Timestamps & {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    auth_id: string;
    birthday: string | null;
    profile_img: string | null;
    deleted: boolean;
};

export type Role = {
    id: number;
    title: string | null;
    role: string | null;
  };