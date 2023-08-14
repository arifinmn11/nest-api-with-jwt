import { HttpStatus } from "@nestjs/common";

export class responseJson {
    data: any;
    message: any;
    statusCode: HttpStatus
    errors: any;

    constructor(statusCode = HttpStatus.OK, message = "Success", data = null, errors = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }
}

export const successResponse = (message = "Success", data = null) => new responseJson(HttpStatus.OK, message, data);
export const notFoundResponse = (message = "Data not found!", error = null) => new responseJson(HttpStatus.NOT_FOUND, message, '', error);
export const badReqResponse = (message = "Parameter wrong!", error = null) => new responseJson(HttpStatus.BAD_REQUEST, message, '', error);
export const internalErrResponse = (message = "Internal sever error!", error = null) => new responseJson(HttpStatus.INTERNAL_SERVER_ERROR, message, '', error);
