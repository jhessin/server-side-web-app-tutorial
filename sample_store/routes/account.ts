/** @format */

import { Router } from 'express';
import { hashSync, compareSync } from 'bcrypt';
import { User } from '../models';
import { Page } from '../components';

const router = Router();

router.get('/', (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect('/');
    return;
  }
  const page = new Page(
    req,
    res,
    next,
    {
      title: 'Account Page',
      user,
    },
    'account',
  );
  page.render();
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/update', (req, res, next) => {
  // check old password
  if (
    compareSync(req.body.currentPassword, req.user.password) &&
    req.body.password === req.body.confirmPassword
  ) {
    User.findById(req.user._id)
      .updateOne({
        password: hashSync(req.body.password, 10),
      })
      .then(user => {
        res.render('account', {
          user: req.user,
          message: 'Successfully updated password',
        });
      })
      .catch(err => {
        res.render('error', {
          title: 'Error Page',
          message: err.message,
          user: req.user,
        });
      });
  } else {
    res.render('error', {
      title: 'Error',
      message: 'Password mismatch',
      user: req.user,
    });
  }
});

router.post('/delete', (req, res, next) => {
  User.findById(req.user._id)
    .deleteOne()
    .then(success => {
      req.logout();
      res.render('account', {
        message: 'Account deleted redirecting to login page...',
        redirect: '/login',
      });
    })
    .catch(err => {
      res.render('error', {
        message: err.message,
        user: req.user,
      });
    });
});

export { router as account };
