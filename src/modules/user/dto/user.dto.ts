import { UserPlan } from 'src/interfaces/enums';

export interface UserCreate {
    username: string;
    password: string;
    email: string;
    plan: UserPlan;
}

export interface UserUpdateRole {
    userId: string;
    plan: UserPlan;
}

export interface GenerateToken {
    username: string;
    password: string;
}
