/** @format */

import { Router } from 'express';
import { Item } from '../models';
import { Page } from '../components';

const router = Router();

router.get('/', (req, res, next) => {
  const { user } = req;

  Item.find()
    .then(items => {
      const page = new Page(
        req,
        res,
        next,
        {
          title: 'Home Page',
          items,
          user,
          partials: {
            content: 'home',
          },
        },
        'base',
      );
      page.render();
      //const data = {
      //title: 'Home Page',
      //items,
      //user,
      //partials: {
      //content: 'homejr',
      //},
      ////DEBUG: true,
      //};
      ////res.render('home', data);
      //res.render('base', data);
    })
    .catch(err => {
      res.render('error', {
        message: err.message,
        user: user,
      });
    });
});

export { router as home };
