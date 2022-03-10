
export interface AuthPayload {
  token: string;
  roles: Array<string>;
}

export interface AuthResponse {
  valid: boolean;
}