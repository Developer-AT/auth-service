export default () => ({
    service: {
        algo: process.env.JWT_ALGO,
        ttl: 30 * 1000,
        keys: {
            private: {
                auth: process.env.PRIVATE_KEY_AUTH
            },
            public: {
                auth: process.env.PUBLIC_KEY_AUTH
            }
        }
    }
});
