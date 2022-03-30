import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
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
import { ClientType } from 'src/interfaces/types';

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

  async generateMasterToken(): Promise<void> {
    await this.kcAdminClient.auth({
      grantType: this.configService.get<GrantTypes>(
        'keycloak.auth.master.grantType',
      ),
      clientId: this.configService.get<string>('keycloak.auth.master.clientId'),
      clientSecret: this.configService.get<string>(
        'keycloak.auth.master.clientSecret',
      ),
    });
  }

  async generateUserToken(credentials: Credentials): Promise<string> {
    await this.kcAdminClient.auth(credentials);
    return this.kcAdminClient.getAccessToken();
  }

  async createUser(user: UserRepresentation): Promise<{
    id: string;
  }> {
    return await this.kcAdminClient.users.create(user);
  }

  async getClients(): Promise<ClientRepresentation[]> {
    return await this.kcAdminClient.clients.find();
  }

  async getClientRoleByName(
    client: ClientType,
    role: string,
  ): Promise<RoleRepresentation> {
    return await this.kcAdminClient.clients.findRole({
      id: this.getClientObjectId(client),
      roleName: role,
    });
  }

  async getRealmRoleByName(
    role: string,
  ): Promise<RoleRepresentation | undefined> {
    return await this.kcAdminClient.roles.findOneByName({
      name: role,
    });
  }

  async roleMappingRealm(
    userId: string,
    role: RoleMappingPayload[],
  ): Promise<void> {
    return await this.kcAdminClient.users.addRealmRoleMappings({
      id: userId,
      roles: role,
    });
  }

  async roleMappingClient(
    userId: string,
    client: ClientType,
    role: RoleMappingPayload[],
  ): Promise<void> {
    return await this.kcAdminClient.users.addClientRoleMappings({
      id: userId,
      clientUniqueId: this.getClientObjectId(client),
      roles: role,
    });
  }

  getClientObjectId(client: ClientType): string {
    switch (client) {
      case 'admin':
        return this.configService.get<string>('keycloak.auth.clientId.admin');

      case 'user':
        return this.configService.get<string>('keycloak.auth.clientId.user');

      default:
        return '';
    }
  }

  getAuthCredForToken(client: ClientType): Credentials {
    switch (client) {
      case 'admin':
        return this.configService.get<Credentials>('keycloak.auth.admin');

      case 'user':
        return this.configService.get<Credentials>('keycloak.auth.user');

      default:
        return this.configService.get<Credentials>('keycloak.auth.master');
    }
  }
}
