import { join } from 'path';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
console.log(__dirname);
@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
