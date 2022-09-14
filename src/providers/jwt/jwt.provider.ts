import { Injectable } from '@nestjs/common';
import {
    SignOptions,
    sign,
    Secret,
    verify,
    VerifyOptions,
    Algorithm,
} from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { ServiceType } from 'src/interfaces/types';

@Injectable()
export class JwtProvider {
    private signOptions: SignOptions;
    private payload: string;
    private privateKey: Secret;
    private verifyOptions: VerifyOptions;
    constructor(private configService: ConfigService) {}

    /**
     * @description Convert Data Object to string
     * @param payload Data Need to Encrypt
     */
    setPayload(payload: { [key: string]: any }) {
        this.payload = JSON.stringify(payload);
    }

    /**
     * @description Set Token Signature related Detail
     */
    private setSignOptions() {
        this.signOptions = {
            algorithm: this.configService.get<Algorithm>('service.algo'),
            expiresIn:
                new Date().getTime() +
                this.configService.get<number>('service.ttl'),
        };
    }

    /**
     * @description Read and Set private key of Auth Service
     */
    private setSecretKey() {
        this.privateKey = readFileSync(
            this.configService.get<string>('service.keys.private.auth'),
            'utf8',
        );
    }

    /**
     * @description Encrypt Payload Data
     * @returns {string} Encrypted Data
     */
    signPayload() {
        try {
            this.setSignOptions();
            this.setSecretKey();
            return sign(this.payload, this.privateKey, this.signOptions);
        } catch (error) {
            Promise.reject(error);
        }
    }

    /**
     * @description Set Requirements To verify Encrypted Data
     */
    private setVerifyOptions() {
        this.verifyOptions = {
            algorithms: [this.configService.get<Algorithm>('service.algo')],
            ignoreExpiration: false,
            complete: true,
        };
    }

    /**
     * @description Verify the JWT token by token origin(Service Type)
     * @param {ServiceType} serviceType To identify the token origin
     * @param {string} token JWT Token
     * @returns {Jwt | JwtPayload} Decode Token
     */
    verifyToken(serviceType: ServiceType, token: string) {
        try {
            this.setVerifyOptions();
            const publicKey = this.fetchPublicKeyByServiceType(serviceType);
            return verify(token, publicKey, this.verifyOptions);
        } catch (error) {
            Promise.reject(error);
        }
    }

    /**
     * @description Read public key of Service by its origin type
     * @param {ServiceType} serviceType To identify the token origin
     * @returns Public Key
     */
    private fetchPublicKeyByServiceType(serviceType: ServiceType) {
        let key;
        switch (serviceType) {
            case 'auth':
                key = this.configService.get<string>(
                    'service.keys.public.auth',
                );
                break;

            case 'book':
                key = this.configService.get<string>(
                    'service.keys.public.book',
                );
                break;

            case 'user':
                key = this.configService.get<string>(
                    'service.keys.public.user',
                );
                break;

            default:
                Promise.reject('Invalid Service Type');
                break;
        }
        return key;
    }
}
