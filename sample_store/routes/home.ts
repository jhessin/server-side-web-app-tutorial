/** @format */

import { Router } from 'express';

const router = Router();

router.get('/', (req, res, next) => {
  const data = {
    title: 'Home Page',
  };
  res.render('home', data);
});

export { router as home };
