import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { UserCreate, GenerateToken } from './dto/user.dto';
import { UserRole, ClientType } from 'src/interfaces/enums';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';

@Injectable()
export class UserService {
    constructor(private readonly keycloak: KeycloakProvider) {}

    /**
     * @description Create User on Keycloak
     * @param {UserCreate} user User Data
     * @returns User's keycloak Id
     */
    async createUser(user: UserCreate) {
        try {
            await this.keycloak.generateMasterToken();
            const kcUser = await this.keycloak.createUser(
                this.formatUserCreate(user),
            );

            const roleDetail = await this.keycloak.getClientRoleByName(
                ClientType.USER,
                user.clientRole,
            );

            await this.keycloak.addClientLevelRoletoUser(
                kcUser.id,
                ClientType.USER,
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
            return kcUser;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Delete existing role of User and add new one
     * @param {string} userId User's Keycloak Id
     * @param {UserRole} roleName Role name that need to be added to user
     * @returns {void} Void
     */
    async updateUserRole(userId: string, roleName: UserRole) {
        try {
            await this.keycloak.generateMasterToken();
            const roles = await this.keycloak.getUserClientLevelRoleById(
                userId,
                ClientType.USER,
            );
            await this.keycloak.deleteUserClientLevelRole(
                userId,
                ClientType.USER,
                this.keycloak.formatRoleMappingPayload(roles),
            );
            const roleDetail = await this.keycloak.getClientRoleByName(
                ClientType.USER,
                roleName,
            );
            await this.keycloak.addClientLevelRoletoUser(
                userId,
                ClientType.USER,
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Generate Bearer Token by Username and Password
     * @param {GenerateToken} payload Data to Generate User Token
     * @returns User Bearer Token
     */
    async generateToken(payload: GenerateToken) {
        try {
            const authCredForToken = this.keycloak.getAuthCredForToken(
                ClientType.USER,
            );
            const dataForToken: Credentials = {
                username: payload.username,
                password: payload.password,
                ...authCredForToken,
            };

            return await this.keycloak.generateUserToken(dataForToken);
        } catch (error) {
            console.error('User--generateToken--Error--', error);
            throw error;
        }
    }

    async getUser() {
        try {
        } catch (error) {}
    }

    /**
     * @description Create User Representation for keycloak from received User data
     * @param {UserCreate} user User Data
     * @returns {UserRepresentation} keycloak User Representation
     */
    formatUserCreate(user: UserCreate): UserRepresentation {
        return {
            username: user.username,
            email: user.email,
            enabled: true,
            emailVerified: true,
            credentials: [
                {
                    type: 'password',
                    value: user.password,
                    temporary: false,
                },
            ],
        };
    }
}
