import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserCreate } from './dto/user.dto';
import { UserService } from './user.service';
import { AccessBy } from 'src/decorators/access.decorator';

@Controller()
export class UserController {
    constructor(private readonly userservice: UserService) {}

    @AccessBy(['user'])
    @GrpcMethod('UserService', 'CreateUser')
    async CreateUser(
        payload: UserCreate,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        return await this.userservice.createUser(payload);
    }
}
