/** @format */

import { Router } from 'express';
import { User, IUser } from '../models';

const router = Router();

router.post('/', (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user: IUser) => {
      // check no user
      if (!user) {
        res.json({
          confirmation: 'fail',
          error: 'Invalid email or password',
        });
        return;
      }

      // check password
      if (user.password !== req.body.password) {
        res.json({
          confirmation: 'fail',
          error: 'Invalid email or password',
        });
        return;
      }
      res.json({
        confirmation: 'success',
        user,
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        error: err,
      });
    });
});

export { router as login };
