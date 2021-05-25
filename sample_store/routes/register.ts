/** @format */

import { Router } from 'express';
import { User } from '../models';

const router = Router();

router.post('/', (req, res) => {
  User.create(req.body)
    .then(user => {
      res.json({
        confirmation: 'success',
        user: user,
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        error: err.message,
      });
    });
});

export { router as register };
