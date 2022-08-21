import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { KeyclockModule } from 'src/providers/keycloak/keycloak.module';

@Module({
    imports: [ConfigModule.forRoot(), KeyclockModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
