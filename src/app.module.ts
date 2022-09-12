import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
@Module({
    imports: [ConfigModule.forRoot(), AuthModule, UserModule, AdminModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
