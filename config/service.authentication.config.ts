export default () => ({
    service: {
        algo: process.env.JWT_ALGO,
        ttl: 60 * 60 * 1000,
        keys: {
            private: {
                auth: process.env.PRIVATE_KEY_AUTH
            },
            public: {
                auth: process.env.PUBLIC_KEY_AUTH,
                user: process.env.PUBLIC_KEY_USER,
                book: process.env.PUBLIC_KEY_BOOK
            }
        }
    }
});
