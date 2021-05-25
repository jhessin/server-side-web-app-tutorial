/** @format */

import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models';
import { hashSync, compareSync } from 'bcrypt';

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
      })
        .then((user: IUser) => {
          // check no user
          if (!user || !compareSync(password, user.password)) {
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

  const localRegister = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, next) => {
      User.findOne({
        email,
      })
        .then((user: IUser) => {
          // check no user
          if (user) {
            return next(new Error('User already exists. Please log in.'));
          }
          // create the new user
          User.create({
            email,
            password: hashSync(password, 10),
          })
            .then(user => {
              return next(null, user);
            })
            .catch(err => {
              return next(err);
            });
        })
        .catch(err => {
          return next(err);
        });
    },
  );

  passport.use('localRegister', localRegister);
};
