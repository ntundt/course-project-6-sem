import { ZodRawShape, z } from 'zod';
import { BadRequestError } from 'routing-controllers';

// use zod to validate incoming data
export default class HttpValidatorBase<T> {
	private _schema: any;

	constructor(schema: ZodRawShape) {
		this._schema = z.object(schema);
	}

	public validateAndThrow(obj: T): void {
		try {
			this._schema.parse(obj);
		} catch (error) {
			throw new BadRequestError(error.errors);
		}
	}
}