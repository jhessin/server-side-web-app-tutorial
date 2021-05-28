/** @format */

import { Router } from 'express';
import { Item } from '../models';

const router = Router();

router.get('/', (req, res, next) => {
  const { user } = req;

  Item.find()
    .then(items => {
      const data = {
        title: 'Home Page',
        items,
        user,
        partials: {
          content: 'homejr',
        },
        //DEBUG: true,
      };
      //res.render('home', data);
      res.render('base', data);
    })
    .catch(err => {
      res.render('error', {
        message: err.message,
        user: user,
      });
    });
});

export { router as home };
