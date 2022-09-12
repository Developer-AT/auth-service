import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { KeyclockModule } from 'src/providers/keycloak/keycloak.module';

@Module({
    imports: [ConfigModule.forRoot(), KeyclockModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
