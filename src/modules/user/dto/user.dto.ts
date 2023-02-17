import { UserRole } from 'src/interfaces/enums';

export interface UserCreate {
    username: string;
    password: string;
    email: string;
    clientRole: UserRole;
}

export interface UserUpdateRole {
    userId: string;
    clientRole: UserRole;
}

export interface GenerateToken {
    username: string;
    password: string;
}
