import { AuthPayload, AuthResponse } from './../interfaces/auth.interface';
import { AuthService } from './../services/auth.service';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller()
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @GrpcMethod('AuthService', 'Validate')
  Validate(payload: AuthPayload, metadata: Metadata, call: ServerUnaryCall<any, any>): AuthResponse {
    return this.authservice.validate(payload);
  }
}
