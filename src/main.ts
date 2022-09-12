import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: process.env.PROTO_AUTH_PACKAGE,
                protoPath: join(__dirname, process.env.PROTO_AUTH_PATH),
                url: process.env.PROTO_AUTH_URL,
            },
        },
    );
    await app.listen();
    // const app = await NestFactory.create(AppModule);
    // app.setGlobalPrefix('api/');
    // const configService = app.get(ConfigService);
}
bootstrap();
