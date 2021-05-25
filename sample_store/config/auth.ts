/** @format */

import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models';

export const auth = (passport: PassportStatic) => {
  passport.serializeUser((user, next) => {
    next(null, user);
  });

  passport.deserializeUser((id, next) => {
    User.findById(id, (err: Error, user: IUser) => {
      next(err, user);
    });
  });

  const localLogin = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, next) => {
      User.findOne({
        email,
        password,
      })
        .then((user: IUser) => {
          // check no user
          if (!user) {
            return next(new Error('Invalid email or password'));
          }

          return next(null, user);
        })
        .catch(err => {
          return next(err);
        });
    },
  );

  passport.use('localLogin', localLogin);
};
