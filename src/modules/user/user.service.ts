import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { UserCreate } from './dto/user.dto';
import { UserRole } from 'src/interfaces/types';

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
                user.client,
                user.clientRole,
            );

            await this.keycloak.addClientLevelRoletoUser(
                kcUser.id,
                'user',
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
            return { success: true, user: kcUser.id, msg: '' };
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    /**
     * @description Delete existing role of User and add new one
     * @param {string} userId User's Keycloak Id
     * @param {UserRole} roleName Role name that need to be added to user
     * @returns return Success
     */
    async updateUserRole(userId: string, roleName: UserRole) {
        try {
            const roles = await this.keycloak.getUserClientLevelRoleById(
                userId,
                'user',
            );
            await this.keycloak.deleteUserClientLevelRole(
                userId,
                'user',
                this.keycloak.formatRoleMappingPayload(roles),
            );
            const roleDetail = await this.keycloak.getClientRoleByName(
                'user',
                roleName,
            );
            await this.keycloak.addClientLevelRoletoUser(
                userId,
                'user',
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
            return { success: true };
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
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
