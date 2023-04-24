import { HttpError } from 'routing-controllers';

export default abstract class ApplicationErrorBase extends HttpError {
	abstract toJSON(): object;
}