import { ClientType } from 'src/interfaces/enums';

export interface AuthPayload {
    token: string;
    roles: string[];
    clientType: ClientType;
}

export interface AuthResponse {
    valid: boolean;
}
