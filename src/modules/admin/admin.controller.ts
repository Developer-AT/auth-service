import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AdminCreate } from './dto/admin.dto';
import { AdminService } from './admin.service';
import { AccessBy } from 'src/decorators/access.decorator';

@Controller()
export class AdminController {
    constructor(private readonly adminservice: AdminService) {}

    @AccessBy('admin')
    @GrpcMethod('AdminService', 'CreateAdmin')
    async CreateUser(
        payload: AdminCreate,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ) {
        return await this.adminservice.createAdmin(payload);
    }
}
