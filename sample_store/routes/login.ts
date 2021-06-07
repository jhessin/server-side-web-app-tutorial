/** @format */

import { Router } from 'express';
import passport from 'passport';
import { Page } from '../components';

const router = Router();

router.post(
	'/',
	passport.authenticate('localLogin', {
		successRedirect: '/',
	}),
);

router.get('/', (req, res, next) => {
	if (req.user) {
		res.redirect('/');
		return;
	}
	const page = new Page(
		req,
		res,
		next,
		{
			title: 'Login Page',
		},
		'login',
	);
	page.render();
});

export { router as login };
