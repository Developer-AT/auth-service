import { AuthResponse } from './../interfaces/auth.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validate(data): AuthResponse {
    console.log(data);
    return {valid: true};
  }
}
