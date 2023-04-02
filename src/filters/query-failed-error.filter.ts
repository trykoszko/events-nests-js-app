import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';
import { QueryFailedError } from "typeorm/error/QueryFailedError";

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
    public catch(exception: QueryFailedError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        return response.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: exception.message
        });
    }
}
