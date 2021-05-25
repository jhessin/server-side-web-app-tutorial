/** @format */

import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post(
  '/',
  passport.authenticate('localLogin', {
    successRedirect: '/account',
  }),
);

export { router as login };
