import { ClientType } from 'src/interfaces/types';

export interface AuthPayload {
  token: string;
  roles: Array<string>;
}

export interface AuthResponse {
  valid: boolean;
}

export interface TokenPayload {
  username: string;
  password: string;
  client: ClientType;
}

export interface TokenResponse {
  token: string;
}
