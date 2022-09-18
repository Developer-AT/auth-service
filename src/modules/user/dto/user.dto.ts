import { UserRole } from "src/interfaces/enums";

export interface UserCreate {
    username: string;
    password: string;
    email: string;
    clientRole: string;
}


export interface UserUpdateRole {
    userId: string;
    roleName: UserRole;
}
