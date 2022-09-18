import { KeyclockModule } from 'src/providers/keycloak/keycloak.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/providers/jwt/jwt.module';
import { UtilsModule } from 'src/providers/utils/utils.module';

@Module({
    imports: [ConfigModule.forRoot(), KeyclockModule, JwtModule, UtilsModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
