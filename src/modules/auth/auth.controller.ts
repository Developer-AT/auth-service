import { HttpResponse } from 'src/interfaces/global.interface';
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
import { GlobalUtilsProvider } from 'src/providers/utils/global.utils.provider';

@Controller()
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
        private readonly globalUtils: GlobalUtilsProvider,
    ) {}

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
    ): Promise<HttpResponse> {
        try {
            const response = await this.authservice.getToken(payload);
            return this.globalUtils.successResponse(response);
        } catch (error) {
            return this.globalUtils.GRpcErrorResponse(error);
        }
    }

    @GrpcMethod('AuthService', 'AuthMicroserviceServiceToken')
    async AuthMicroserviceServiceToken(
        payload: TokenPayload,
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
