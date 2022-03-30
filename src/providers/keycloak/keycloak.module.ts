import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import keycloakConfig from 'config/keycloak.config';
import { KeycloakProvider } from './keycloak.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [keycloakConfig],
    }),
  ],
  providers: [KeycloakProvider],
  exports: [KeycloakProvider],
})
export class KeyclockModule {}
