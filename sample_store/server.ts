/** @format */

// Module imports
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';

// route imports
import { home, register, login } from './routes';

// Express App
const app = express();

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

// connect to database
mongoose.connect(
  'mongodb://localhost/sample-store',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
