import { HttpException } from '@nestjs/common';
import { AcceptAny } from 'src/interfaces/types';

export class KeyClockException extends HttpException {
    constructor(error: Record<string, AcceptAny>) {
        super(error.response.statusText, error.response.status);
    }
}
