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

    setPayload(payload: { [key: string]: any }) {
        this.payload = JSON.stringify(payload);
    }

    setSignOptions() {
        this.signOptions = {
            algorithm: this.configService.get<Algorithm>('service.algo'),
            expiresIn:
                new Date().getTime() +
                this.configService.get<number>('service.ttl'),
        };
    }

    setSecretKey() {
        this.privateKey = readFileSync(
            this.configService.get<string>('service.keys.private.auth'),
            'utf8',
        );
    }

    signPayload() {
        try {
            return sign(this.payload, this.privateKey, this.signOptions);
        } catch (error) {
            Promise.reject(error);
        }
    }

    setVerifyOptions() {
        this.verifyOptions = {
            algorithms: [this.configService.get<Algorithm>('service.algo')],
            ignoreExpiration: false,
        };
    }

    verifyToken(serviceType: ServiceType, token: string) {
        try {
            this.setVerifyOptions();
            const publicKey = this.fetchPublicKeyByServiceType(serviceType);
            return verify(token, publicKey, this.verifyOptions);
        } catch (error) {
            Promise.reject(error);
        }
    }

    fetchPublicKeyByServiceType(serviceType: ServiceType) {
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
