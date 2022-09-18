import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { AuthResponse, TokenPayload, TokenResponse } from './dto/auth.dto';
import { JwtProvider } from './../../providers/jwt/jwt.provider';

@Injectable()
export class AuthService {
    constructor(
        private readonly keycloak: KeycloakProvider,
        private readonly jwt: JwtProvider,
    ) {}
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

    /**
     * @description Genearte Token for Auth Microservice
     * @returns {string} Bearer Token for Auth Microservice
     */
    async authMicroserviceServiceToken(): Promise<string> {
        try {
            this.jwt.setPayload({});
            return this.jwt.signPayload();
        } catch (error) {
            throw error;
        }
    }
}
