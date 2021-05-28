/** @format */

import { Router } from 'express';
import passport from 'passport';

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
  const data = {
    title: 'Home Page',
  };
  res.render('login', data);
});

export { router as login };
