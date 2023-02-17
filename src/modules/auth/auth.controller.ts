import { ClientType } from 'src/interfaces/enums';
import { Empty, HttpResponse } from 'src/interfaces/global.interface';
import { AuthService } from './auth.service';
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AuthPayload, AuthResponse } from './dto/auth.dto';
import { GlobalUtilsProvider } from 'src/providers/utils/global.utils.provider';
import { AccessBy } from 'src/decorators/access.decorator';
import { MicroserviceGuard } from 'src/guards/microservice.guard';

@Controller()
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
        private readonly globalUtils: GlobalUtilsProvider,
    ) {}

    @AccessBy(ClientType.USER)
    @UseGuards(MicroserviceGuard)
    @GrpcMethod('AuthService', 'Validate')
    async Validate(
        payload: AuthPayload,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            console.log('payload :: ', payload);
            return this.globalUtils.successResponse({
                userId: await this.authservice.validate(payload),
            });
        } catch (error) {
            console.error('Auth--Controller--Validate--Error', error);
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }

    @GrpcMethod('AuthService', 'AuthMicroserviceServiceToken')
    async AuthMicroserviceServiceToken(
        payload: Empty,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            return this.globalUtils.successResponse({
                token: await this.authservice.authMicroserviceServiceToken(),
            });
        } catch (error) {
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }
}
