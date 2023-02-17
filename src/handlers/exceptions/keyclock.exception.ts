import { HttpException } from '@nestjs/common';
import { AcceptAny } from 'src/interfaces/types';

export class KeyClockException extends HttpException {
    constructor(error: Record<string, AcceptAny>) {
        const errorMsg =
            error.response.data.errorMessage || error.response.statusText;
        super(errorMsg, error.response.status);
    }
}
