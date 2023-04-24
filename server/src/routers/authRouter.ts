import { Router } from 'express';
import { PassportStatic } from 'passport';

function createRouter(passport: PassportStatic) {
	const router = Router();

	router.get('/oauth2/authorize', (req, res) => {
		res.send()
	});
	
	return router;
}