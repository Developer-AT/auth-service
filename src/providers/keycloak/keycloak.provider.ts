import { KeyClockException } from './../../handlers/exceptions/keyclock.exception';
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation, {
    RoleMappingPayload,
} from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import {
    Credentials,
    GrantTypes,
} from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { ClientType } from 'src/interfaces/enums';

@Injectable()
export class KeycloakProvider {
    private kcAdminClient: KcAdminClient;
    constructor(private configService: ConfigService) {
        this.kcAdminClient = new KcAdminClient();
        this.kcAdminClient.setConfig({
            baseUrl: this.configService.get<string>('keycloak.baseUrl'),
            realmName: this.configService.get<string>('keycloak.realm'),
        });
    }

    /**
     * @description Set Master Authentication Token to Keycloak Admin client
     * @returns {void} Void
     */
    async generateMasterToken(): Promise<void> {
        try {
            await this.kcAdminClient.auth({
                grantType: this.configService.get<GrantTypes>(
                    'keycloak.auth.master.grantType',
                ),
                clientId: this.configService.get<string>(
                    'keycloak.auth.master.clientId',
                ),
                clientSecret: this.configService.get<string>(
                    'keycloak.auth.master.clientSecret',
                ),
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Generate User Access Token if User's Credential is valid
     * @param {Credentials} credentials Client Credential to Generate Token
     * @returns {string} User Access Token
     */
    async generateUserToken(credentials: Credentials): Promise<string> {
        try {
            await this.kcAdminClient.auth(credentials);
            return this.kcAdminClient.getAccessToken();
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Create User's Profile on Keycloak
     * @param {UserRepresentation} user User's Data
     * @returns User's Keycloack Id
     */
    async createUser(user: UserRepresentation): Promise<{
        id: string;
    }> {
        try {
            return await this.kcAdminClient.users.create(user);
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Keycloak Client List related to Specific Realm
     * Client: Entity on Keycloak used to distinguish User base
     * ( eg. Admin linked to -> admin Client, User linked to -> user Client)
     * @returns {ClientRepresentation} Keycloak Client Data
     */
    async getClients(): Promise<ClientRepresentation[]> {
        try {
            return await this.kcAdminClient.clients.find();
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Get Client Level Role Detail by its Name
     * @param {ClientType} client Client name (admin | user)
     * @param {string} role Role name and it should exist in Client
     * @returns {RoleRepresentation} Role Detail
     */
    async getClientRoleByName(
        client: ClientType,
        role: string,
    ): Promise<RoleRepresentation> {
        try {
            return await this.kcAdminClient.clients.findRole({
                id: this.getClientObjectId(client),
                roleName: role,
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Get Realm level Role detail by its name
     * @param {string} role Role Name
     * @returns {RoleRepresentation} Role Detail
     */
    async getRealmRoleByName(
        role: string,
    ): Promise<RoleRepresentation | undefined> {
        try {
            return await this.kcAdminClient.roles.findOneByName({
                name: role,
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Add Realm level Role to a User's Profile
     * @param {string} userId Keycloak User Id
     * @param {RoleMappingPayload} role Role Data
     * @returns {void} Void
     */
    async addRealmLevelRoletoUser(
        userId: string,
        role: RoleMappingPayload[],
    ): Promise<void> {
        try {
            return await this.kcAdminClient.users.addRealmRoleMappings({
                id: userId,
                roles: role,
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @desciption Add Client level Role to a User's Profile
     * @param {string} userId Keycloak User's Id
     * @param {ClientType} client Client Type (admin, user etc...)
     * @param {RoleMappingPayload} role Role Detail
     * @returns {void} Void
     */
    async addClientLevelRoletoUser(
        userId: string,
        client: ClientType,
        role: RoleMappingPayload[],
    ): Promise<void> {
        try {
            return await this.kcAdminClient.users.addClientRoleMappings({
                id: userId,
                clientUniqueId: this.getClientObjectId(client),
                roles: role,
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Fetch User's Client Level Role
     * @param {string} userId Keycloak User's Id
     * @param {ClientType} client Client Type (admin, user etc...)
     * @returns {RoleRepresentation[]} Roles Associated to User
     */
    async getUserClientLevelRoleById(
        userId: string,
        client: ClientType,
    ): Promise<RoleRepresentation[]> {
        try {
            return await this.kcAdminClient.users.listClientRoleMappings({
                id: userId,
                clientUniqueId: this.getClientObjectId(client),
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Delete associated roles of user
     * @param {string} userId Keycloak User's Id
     * @param {ClientType} client Client Type (admin, user etc...)
     * @param {RoleMappingPayload[]} roles Roles Data need to be deleted
     * @returns {void} Void
     */
    async deleteUserClientLevelRole(
        userId: string,
        client: ClientType,
        roles: RoleMappingPayload[],
    ): Promise<void> {
        try {
            return await this.kcAdminClient.users.delClientRoleMappings({
                id: userId,
                clientUniqueId: this.getClientObjectId(client),
                roles: roles,
            });
        } catch (error) {
            throw new KeyClockException(error);
        }
    }

    /**
     * @description Fetch Keycloak Client Object Id by Client Id (Name)
     * @param {string} client Client Type (admin, user etc...)
     * @returns {string} Client Keycloak Object Id
     */
    getClientObjectId(client: ClientType): string {
        switch (client) {
            case ClientType.ADMIN:
                return this.configService.get<string>(
                    'keycloak.auth.clientObjectId.admin',
                );

            case ClientType.USER:
                return this.configService.get<string>(
                    'keycloak.auth.clientObjectId.user',
                );

            default:
                return '';
        }
    }

    /**
     * @description Fetch Client Auth Credential by Client Id(Name)
     * @param {string} client Client Type (admin, user etc...)
     * @returns {Credentials} Client Credentials
     */
    getAuthCredForToken(client: ClientType): Credentials {
        switch (client) {
            case ClientType.ADMIN:
                return this.configService.get<Credentials>(
                    'keycloak.auth.admin',
                );

            case ClientType.USER:
                return this.configService.get<Credentials>(
                    'keycloak.auth.user',
                );

            default:
                return this.configService.get<Credentials>(
                    'keycloak.auth.master',
                );
        }
    }

    /**
     * @description Convert keycloak RoleRepresentation to RoleMappingPayload
     * @param {RoleRepresentation[]} roles RoleRepresentation of keycloak
     * @returns {RoleMappingPayload[]} RoleMapping Payload for Keycloak role operations
     */
    formatRoleMappingPayload(
        roles: RoleRepresentation[],
    ): RoleMappingPayload[] {
        return roles.map((role) => {
            return {
                id: role.id,
                name: role.name,
            };
        });
    }
}
