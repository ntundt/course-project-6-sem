import { Middleware, ExpressErrorMiddlewareInterface, HttpError, UnauthorizedError, BadRequestError } from 'routing-controllers';
import ApplicationErrorBase from './Errors/ApplicationErrorBase';
import { ZodError } from 'zod';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
	error(error: any, request: any, response: any, next: (err?: any) => any) {
		console.log('ErrorHandlerMiddleware error', error);

		if (error instanceof ApplicationErrorBase) {
			response.status(error.httpCode).json({
				err: error.httpCode,
				message: error.message,
			});
			return;
		}

		if (error instanceof UnauthorizedError) {
			response.status(401).json({
				err: 401,
				message: 'Unauthorized',
			});
			return;
		}

		if (error instanceof ZodError) {
			const message = error.issues.map(issue => issue.path.join('.') + ': ' + issue.message).join(', ');
			response.status(400).json({
				err: 400,
				message: message,
			});
			return;
		}
		
		if (error instanceof Error) {
			response.status(500).json({
				err: 500,
				message: 'Internal server error',
			});
			console.error(error);
			return;
		}

		next(error);
	}
}
