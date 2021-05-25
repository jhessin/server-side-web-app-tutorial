/** @format */

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    user: req.user || 'not logged in',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({
    confirmation: 'user logged out',
  });
});

//router.post('/', (req, res, next) => {
//User.findOne(req.body)
//.then((user: IUser) => {
//// check no user
//if (!user) {
//return next(new Error('Invalid email or password'));
//}

//res.json({
//confirmation: 'success',
//user,
//});
//})
//.catch(err => {
//return next(err);
//});
//});

export { router as account };
