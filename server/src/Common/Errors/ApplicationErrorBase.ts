import { HttpError } from 'routing-controllers';

export default abstract class ApplicationErrorBase {
	public abstract payload: object | undefined;
	public abstract httpCode: number;
	public abstract message: string;
	abstract toJSON(): object;
}