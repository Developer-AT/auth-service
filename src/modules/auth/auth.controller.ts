import { AuthService } from './auth.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {
  AuthPayload,
  AuthResponse,
  TokenPayload,
  TokenResponse,
} from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @GrpcMethod('AuthService', 'Validate')
  Validate(
    payload: AuthPayload,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): AuthResponse {
    return this.authservice.validate(payload);
  }

  @GrpcMethod('AuthService', 'Token')
  async Token(
    payload: TokenPayload,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<TokenResponse> {
    return await this.authservice.getToken(payload);
  }
}
