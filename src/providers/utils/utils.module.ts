import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalUtilsProvider } from './global.utils.provider';

@Module({
    imports: [],
    providers: [GlobalUtilsProvider],
    exports: [GlobalUtilsProvider],
})
export class UtilsModule {}
