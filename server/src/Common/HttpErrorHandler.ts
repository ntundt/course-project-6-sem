import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import ApplicationErrorBase from './Errors/ApplicationErrorBase';

@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        if (error.toJSON instanceof ApplicationErrorBase) {
            response.status(error.httpCode).end(error.toJSON());
        } else {
			response.status(500).json({error: 1, message: 'Internal server error'})
		}

        next(error);
    }
}