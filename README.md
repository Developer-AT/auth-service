## Description

Auth Microservice Based on NestJs

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Abhishek Tyagi]

## Proto File Structure

syntax = "proto3";

package auth;

service AuthService {
  rpc Validate(AuthPayload) returns (AuthResponse) {}
}

message AuthPayload{
  string token = 1;
  repeated string roles = 2;
}

message AuthResponse{
  bool valid = 1;
}


## Keyclock Roles Description

$ default Roles for Account created on Key clock

"account": {
  "roles": [
    "manage-account",
    "manage-account-links",
    "view-profile"
  ]
}

Create User on Keyclock

docker run -d -p 5000:5000 --network=microservice --name=auth-service 2551682dc2c9

docker logs --follow 