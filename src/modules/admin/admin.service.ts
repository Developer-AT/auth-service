import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { AdminCreate } from './dto/admin.dto';
import { AdminRole } from 'src/interfaces/types';

@Injectable()
export class AdminService {
    constructor(private readonly keycloak: KeycloakProvider) {}

    /**
     * @description Create Admin on Keycloak
     * @param {AdminCreate} admin Admin Data
     * @returns Admin's keycloak Id
     */
    async createAdmin(admin: AdminCreate) {
        try {
            await this.keycloak.generateMasterToken();
            const kcUser = await this.keycloak.createUser(
                this.formatAdminCreate(admin),
            );

            const roleDetail = await this.keycloak.getClientRoleByName(
                'admin',
                admin.clientRole,
            );

            await this.keycloak.addClientLevelRoletoUser(
                kcUser.id,
                'admin',
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
            return { success: true, user: kcUser.id, msg: '' };
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    /**
     * @description Delete existing role of Admin and add new one
     * @param {string} adminId Admin's Keycloak Id
     * @param {UserRole} roleName Role name that need to be added to admin
     * @returns return Success
     */
    async updateAdminRole(adminId: string, roleName: AdminRole) {
        try {
            const roles = await this.keycloak.getUserClientLevelRoleById(
                adminId,
                'admin',
            );
            await this.keycloak.deleteUserClientLevelRole(
                adminId,
                'admin',
                this.keycloak.formatRoleMappingPayload(roles),
            );
            const roleDetail = await this.keycloak.getClientRoleByName(
                'admin',
                roleName,
            );
            await this.keycloak.addClientLevelRoletoUser(
                adminId,
                'admin',
                this.keycloak.formatRoleMappingPayload([roleDetail]),
            );
            return { success: true };
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    /**
     * @description Create User Representation for keycloak from received User data
     * @param {AdminCreate} admin Admin's Data
     * @returns {UserRepresentation} keycloak User Representation
     */
    formatAdminCreate(admin: AdminCreate): UserRepresentation {
        return {
            username: admin.username,
            email: admin.email,
            enabled: true,
            emailVerified: true,
            credentials: [
                {
                    type: 'password',
                    value: admin.password,
                    temporary: false,
                },
            ],
        };
    }
}
