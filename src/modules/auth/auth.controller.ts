import { ServiceType } from 'src/interfaces/enums';
import { Empty, HttpResponse } from 'src/interfaces/global.interface';
import { AuthService } from './auth.service';
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AuthPayload, AuthResponse } from './dto/auth.dto';
import { ResponseUtilsProvider } from 'src/providers/utils/response.utils.provider';
import { AccessBy } from 'src/decorators/access.decorator';
import { MicroserviceGuard } from 'src/guards/microservice.guard';

@Controller()
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
        private readonly responseUtils: ResponseUtilsProvider,
    ) {}

    @GrpcMethod('AuthService', 'Validate')
    @AccessBy(ServiceType.USER, ServiceType.PRODUCT)
    @UseGuards(MicroserviceGuard)
    async Validate(
        payload: AuthPayload,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            console.log('payload :: ', payload);
            return this.responseUtils.successResponse({
                userKeycloakId: await this.authservice.validate(payload),
            });
        } catch (error) {
            console.error('Auth--Controller--Validate--Error', error);
            return this.responseUtils.errorResponse(error);
        }
    }

    @GrpcMethod('AuthService', 'AuthMicroserviceServiceToken')
    async AuthMicroserviceServiceToken(
        payload: Empty,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        try {
            return this.responseUtils.successResponse({
                token: await this.authservice.authMicroserviceServiceToken(),
            });
        } catch (error) {
            return this.responseUtils.errorResponse(error);
        }
    }
}
