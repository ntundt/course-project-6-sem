import { Router } from 'express';
import passport from 'passport';
import express from 'express';

function createRouter(passport: passport.Authenticator<express.Handler, any, any, passport.AuthenticateOptions>) {
	const router = Router();

	router.get('/', 
		passport.authenticate('oauth2', { session: false, scope: 'messaging', failureRedirect: '/login' }),
		(req, res) => {
			res.send('Hello World!');
		}
	);
	
	return router;
}

export default createRouter;
