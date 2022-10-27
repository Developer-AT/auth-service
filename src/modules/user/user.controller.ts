import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserCreate, UserUpdateRole, GenerateToken } from './dto/user.dto';
import { UserService } from './user.service';
import { AccessBy } from 'src/decorators/access.decorator';
import { MicroserviceGuard } from 'src/guards/microservice.guard';
import { GlobalUtilsProvider } from 'src/providers/utils/global.utils.provider';
import { HttpStatusMessage } from 'src/interfaces/enums';

@Controller()
export class UserController {
    constructor(
        private readonly userservice: UserService,
        private readonly globalUtils: GlobalUtilsProvider,
    ) {}

    @AccessBy(['user'])
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('UserService', 'Create')
    async Create(
        payload: UserCreate,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            return await this.userservice.createUser(payload);
        } catch (error) {
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }

    @AccessBy(['user'])
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
                payload.roleName,
            );
            return this.globalUtils.successResponse(
                {},
                HttpStatus.ACCEPTED,
                HttpStatusMessage.ACCEPTED,
            );
        } catch (error) {
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }

    @AccessBy(['user'])
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('UserService', 'GenerateToken')
    async GenerateToken(
        payload: GenerateToken,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            const token = await this.userservice.generateToken(payload);
            return this.globalUtils.successResponse({
                token: token,
            });
        } catch (error) {
            console.error('User--GenerateToken--Error--', error);
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }
}
