import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { AuthResponse, TokenPayload, TokenResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly keycloak: KeycloakProvider) {}
  validate(data): AuthResponse {
    console.log(data);
    return { valid: true };
  }

  async getToken(tokenPayload: TokenPayload): Promise<TokenResponse> {
    try {
      return {
        token: await this.keycloak.generateUserToken(
          this.formatKeycloakTokenPayload(tokenPayload),
        ),
      };
    } catch (err) {
      console.log('Token Error :: ', err);
      return { token: '' };
    }
  }

  formatKeycloakTokenPayload(tokenPayload: TokenPayload): Credentials {
    const config = this.keycloak.getAuthCredForToken(tokenPayload.client);
    return Object.assign(config, {
      username: tokenPayload.username,
      password: tokenPayload.password,
    });
  }
}
