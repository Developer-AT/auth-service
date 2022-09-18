import { HttpStatusMessage } from 'src/interfaces/enums';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { AcceptAny } from 'src/interfaces/types';
import { HttpResponse } from 'src/interfaces/global.interface';

@Injectable()
export class GlobalUtilsProvider {
    /**
     * @description Construct Success Response Object
     * @param {Record<string, AcceptAny>} data Actual Data to be Provided in Response
     * @param {number} status Status Code for Response
     * @param {string} statusMsg Status Msg for Response
     * @returns {HttpResponse} Response Object
     */
    successResponse(
        data: Record<string, AcceptAny>,
        status: number = HttpStatus.OK,
        statusMsg: string = HttpStatusMessage.OK,
    ): HttpResponse {
        const response: HttpResponse = {
            status: status,
            message: statusMsg,
            timestamp: new Date().toISOString(),
            data: data,
            error: {},
        };
        return response;
    }

    /**
     * @description Construct Error Response Object
     * @param {HttpException} error Error Object
     * @param {number} status Status Code for Response
     * @param {string} statusMsg Status Msg for Response
     * @returns {HttpResponse} Error Response Object
     */
    GRpcErrorResponse(
        error: HttpException,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        statusMsg: HttpStatusMessage = HttpStatusMessage.BAD_REQUEST,
    ): HttpResponse {
        const ErrorResponse: HttpResponse = {
            status: error.getStatus() || status,
            message: error.message || statusMsg,
            timestamp: new Date().toISOString(),
            data: {},
            error: <object>error.getResponse() || {},
        };
        return ErrorResponse;
    }
}
