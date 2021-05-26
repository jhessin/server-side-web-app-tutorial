/** @format */

import { Router } from 'express';
import { User } from '../models';

const router = Router();

router.get('/', (req, res, next) => {
  const { user } = req;

  const data = {
    title: 'Home Page',
    user,
    //DEBUG: true,
  };
  res.render('home', data);
});

router.post('/purge', (req, res, next) => {
  User.collection
    .drop()
    .then(success => {
      console.log(`purge complete: ${success}`);
      res.redirect('/login');
    })
    .catch(err => {
      res.render('error', {
        title: 'Drop Error',
        message: err.message,
        user: req.user,
      });
    });
});

export { router as home };
