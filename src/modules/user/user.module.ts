import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { KeyclockModule } from 'src/providers/keycloak/keycloak.module';
import { JwtModule } from 'src/providers/jwt/jwt.module';
import { UtilsModule } from 'src/providers/utils/utils.module';

@Module({
    imports: [ConfigModule.forRoot(), KeyclockModule, JwtModule, UtilsModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
