import { Controller, UseGuards, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserCreate, UserUpdateRole, GenerateToken } from './dto/user.dto';
import { UserService } from './user.service';
import { AccessBy } from 'src/decorators/access.decorator';
import { MicroserviceGuard } from 'src/guards/microservice.guard';
import { ResponseUtilsProvider } from 'src/providers/utils/response.utils.provider';
import { HttpStatusMessage, ClientType } from 'src/interfaces/enums';

@Controller()
export class UserController {
    constructor(
        private readonly userservice: UserService,
        private readonly responseUtils: ResponseUtilsProvider,
    ) {}

    @AccessBy(ClientType.USER)
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('UserService', 'Create')
    async Create(
        payload: UserCreate,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            const response = await this.userservice.createUser(payload);
            return this.responseUtils.successResponse(
                response,
                HttpStatus.CREATED,
                HttpStatusMessage.CREATED,
            );
        } catch (error) {
            return this.responseUtils.errorResponse(error);
        }
    }

    @AccessBy(ClientType.USER)
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('UserService', 'UpdateRole')
    async UpdateRole(
        payload: UserUpdateRole,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            await this.userservice.updateUserRole(
                payload.userId,
                payload.clientRole,
            );
            return this.responseUtils.successResponse(
                {},
                HttpStatus.ACCEPTED,
                HttpStatusMessage.ACCEPTED,
            );
        } catch (error) {
            return this.responseUtils.errorResponse(error);
        }
    }

    @AccessBy(ClientType.USER)
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('UserService', 'GenerateToken')
    async GenerateToken(
        payload: GenerateToken,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            console.log('payload :: ', payload);
            console.log(metadata);
            // console.log(call);
            const token = await this.userservice.generateToken(payload);
            return this.responseUtils.successResponse({
                token: token,
            });
        } catch (error) {
            console.error('User--GenerateToken--Error--', error);
            return this.responseUtils.errorResponse(error);
        }
    }
}
