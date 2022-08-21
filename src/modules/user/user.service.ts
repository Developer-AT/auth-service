import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { KeycloakProvider } from 'src/providers/keycloak/keycloak.provider';
import { UserCreate } from './dto/user.dto';
import RoleRepresentation, {
    RoleMappingPayload,
} from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@Injectable()
export class UserService {
    constructor(private readonly keycloak: KeycloakProvider) {}

    async createUser(user: UserCreate) {
        try {
            await this.keycloak.generateMasterToken();
            const kcUser = await this.keycloak.createUser(
                this.formatUserCreate(user),
            );

            const clientRole = await this.keycloak.getClientRoleByName(
                user.client,
                user.clientRole,
            );

            await this.keycloak.roleMappingClient(kcUser.id, user.client, [
                this.formatUserRoleMapping(clientRole),
            ]);

            return { sucess: true, user: kcUser.id, msg: '' };
        } catch (err) {
            console.log(err);
            return { success: false, user: '', msg: err.message };
        }
    }

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

    formatUserRoleMapping(clientRole: RoleRepresentation): RoleMappingPayload {
        return {
            id: clientRole.id,
            name: clientRole.name,
        };
    }
}
