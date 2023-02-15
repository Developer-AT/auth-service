FROM node:16.17.1

ADD https://www.dropbox.com/s/4kqiruqms06a6zt/auth.service.private.key?dl=1 ./keys/private/auth.service.private.key
ADD https://www.dropbox.com/s/wwuik39gv64okqj/book.service.private.key?dl=1 ./keys/private/book.service.private.key
ADD https://www.dropbox.com/s/l5vuewj9bxcn3wh/user.service.private.key?dl=1 ./keys/private/user.service.private.key

ADD https://www.dropbox.com/s/rqqfkz63h1331cb/auth.service.public.key?dl=1 ./keys/public/auth.service.public.key
ADD https://www.dropbox.com/s/ln8tsj29ch9bzuj/book.service.public.key?dl=1 ./keys/public/book.service.public.key
ADD https://www.dropbox.com/s/7nx7lmb2s7615hd/user.service.public.key?dl=1 ./keys/public/user.service.public.key

ADD https://www.dropbox.com/s/ta1dbuw4a7nqq12/auth.proto?dl=1 ./proto/auth.proto
ADD https://www.dropbox.com/s/r1e4a5noh7jtm2h/book.proto?dl=1 ./proto/book.proto
ADD https://www.dropbox.com/s/cbty381h707x1ki/user.proto?dl=1 ./proto/user.proto

WORKDIR /app

RUN npm install pm2 -g

COPY package*.json ./

RUN npm install

COPY . .

ENV PROTO_AUTH_PACKAGE='auth'
ENV PROTO_AUTH_PATH='../../../proto/auth.proto'
ENV PROTO_AUTH_URL='0.0.0.0:5000'


ENV MASTER_CLIENT_ID='library'
ENV MASTER_CLIENT_SECRET='yXzRblz4HlRsRHcTrBhCGSheMTGcSuRq'

ENV USER_CLIENT_ID='user'
ENV USER_CLIENT_SECRET='IC09nuceeyKLTW6lXppotvZzlOoqwKfx'
ENV USER_CLIENT_OBJECT_ID='bec0bfb3-d3d2-42c4-a994-18dbfe2e3bd2'

ENV ADMIN_CLIENT_ID='admin'
ENV ADMIN_CLIENT_SECRET='3DGmcs8gmBtm2Jkp8YCMY4fAIg9BP54P'
ENV ADMIN_CLIENT_OBJECT_ID='0cd7d82f-6040-423a-b6f8-8e1f67dfe864'

ENV KEYCLOAK_BASE_URL='127.0.0.1:8080'

ENV REALM='library'

ENV JWT_ALGO='RS256'
ENV PRIVATE_KEY_AUTH='./../../../../../keys/private/auth.service.private.key'
ENV PUBLIC_KEY_AUTH='./../../../../../keys/public/auth.service.public.key'
ENV PUBLIC_KEY_USER='./../../../../../keys/public/user.service.public.key'
ENV PUBLIC_KEY_BOOK='./../../../../../keys/public/book.service.public.key'

EXPOSE 5000

CMD [ "npm", "start:dev" ]