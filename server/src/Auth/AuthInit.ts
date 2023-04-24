import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { Passport } from 'passport';

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'test_secret'
}

export default new Strategy(opts, (jwtPayload, done) => {
	console.log('verifying token');
	console.log(jwtPayload);

	if (jwtPayload.expiresAt < Math.floor(new Date().getTime() / 1000)) {
		return done(null, false);
	}

	return done(null, jwtPayload);
});