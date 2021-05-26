/** @format */

// dotenv config
//require('dotenv').config();
import 'dotenv/config';

// Module imports
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

// route imports
import { home, register, login, account } from './routes';

// config imports
import { auth } from './config';
auth(passport);

// Express App
const app = express();

// add session library
app.use(
  session({
    secret: 'aokebrcoek',
    resave: true,
    saveUninitialized: true,
  }),
);

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Set view engine and views directory
app.set('view engine', 'hjs');
app.set('views', path.join(__dirname, 'views'));

// parse post data as json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set public directory
app.use(express.static(path.join(__dirname, 'public')));

// set up routes
app.use('/', home);
app.use('/register', register);
app.use('/login', login);
app.use('/account', account);

// Set up an error route
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.render('error', {
      message: err.message,
    });
  },
);

const { DB_HOST, DB_USER, DB_PASS } = process.env;

// connect to database
mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/sample-store?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) {
      console.error(`DB Connection Failed: ${err.message}`);
      return;
    }

    console.log('DB Connection success');
    app.listen(8080, '0.0.0.0', () => {
      console.log('App running on port 8080');
    });
  },
);
