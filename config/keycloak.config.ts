export default () => ({
    keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE_URL,
        realm: process.env.REALM,
        auth: {
            master: {
                grantType: 'client_credentials',
                clientId: process.env.MASTER_CLIENT_ID,
                clientSecret: process.env.MASTER_CLIENT_SECRET,
            },
            user: {
                grantType: 'password',
                clientId: process.env.USER_CLIENT_ID,
                clientSecret: process.env.USER_CLIENT_SECRET,
            },
            admin: {
                grantType: 'password',
                clientId: process.env.ADMIN_CLIENT_ID,
                clientSecret: process.env.ADMIN_CLIENT_SECRET,
            },
            clientObjectId: {
                user: process.env.USER_CLIENT_OBJECT_ID,
                admin: process.env.ADMIN_CLIENT_OBJECT_ID,
            },
        },
    },
});
