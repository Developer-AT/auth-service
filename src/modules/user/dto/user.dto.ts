import { ClientType } from 'src/interfaces/types';

export interface UserCreate {
    username: string;
    password: string;
    email: string;
    client: ClientType;
    clientRole: string;
}
