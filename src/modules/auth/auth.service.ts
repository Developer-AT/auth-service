import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { AuthPayload } from './dto/auth.dto';
import { JwtProvider } from './../../providers/jwt/jwt.provider';
import { JwtPayload } from 'jsonwebtoken';
import { ClientType } from 'src/interfaces/enums';

@Injectable()
export class AuthService {
    constructor(
        private readonly keycloak: KeycloakProvider,
        private readonly jwt: JwtProvider,
    ) {}
    async validate(data: AuthPayload) {
        try {
            const decodedToken = await this.jwt.decodeToken(data.token);
            if (
                !this.isTokenContainRequiredInfo(decodedToken, data.clientType)
            ) {
                throw new HttpException(
                    'Invalid Auth Startegy',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            if (decodedToken.typ != 'Bearer') {
                throw new HttpException(
                    'Invalid Auth Startegy',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const roles: string[] =
                decodedToken.resource_access[data.clientType].roles;
            if (
                roles.length < 1 ||
                !this.isUserHasValidRole(roles, data.roles)
            ) {
                throw new HttpException(
                    'Access not Allowed',
                    HttpStatus.FORBIDDEN,
                );
            }

            const userId = decodedToken.sub;
            return userId;
        } catch (error) {
            throw error;
        }
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

    /**
     * Validate is Jwt Token contain required info or not
     * @param {JwtPayload} token Decoded Token
     * @param {ClientType} clientType To identfy- Token is for User or Admin
     * @returns {boolean} Boolean
     */
    private isTokenContainRequiredInfo(
        token: JwtPayload,
        clientType: ClientType,
    ): boolean {
        return Boolean(
            token.typ &&
                token.sub &&
                token.resource_access &&
                token.resource_access[clientType] &&
                token.resource_access[clientType].roles,
        );
    }

    /**
     * @description Validate User conatins valid access roles or not
     * @param {string[]} userRole Roles Associated to user
     * @param {string[]} roleRequired Roles required on user
     * @returns {boolean} Boolean
     */
    async isUserHasValidRole(userRole: string[], roleRequired: string[]) {
        let roleExist: boolean = false;
        roleRequired.forEach((role) => {
            if (userRole.indexOf(role) > -1) {
                roleExist = true;
            }
        });
        return roleExist;
    }
}
