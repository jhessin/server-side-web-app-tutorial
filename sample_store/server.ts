/** @format */

import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
  res.send('This is the home route');
});

app.listen(8080, '0.0.0.0', () => {
  console.log('App running on port 8080');
});
