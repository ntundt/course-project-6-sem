import { ZodRawShape, z } from 'zod';

export default class HttpValidatorBase<T> {
	private _schema: any;

	constructor(schema: ZodRawShape) {
		this._schema = z.object(schema);
	}

	public validateAndThrow(obj: T): void {
		this._schema.parse(obj);
	}
}