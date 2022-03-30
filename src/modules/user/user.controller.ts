import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserCreate } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @GrpcMethod('UserKeycloakService', 'CreateUser')
  async CreateUser(payload: UserCreate, metadata: Metadata, call: ServerUnaryCall<any, any>){
    return await this.userservice.createUser(payload);
  }

}
