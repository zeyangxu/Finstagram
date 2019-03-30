const express = require('express'),
  app = express(),
  bunyan = require('bunyan');

app.use(express.json());
const log = bunyan.createLogger({ name: 'express' });
const auth = require('./routes/api/auth');
const register = require('./routes/api/register');
const db = require('./routes/api/db');
app.use('/api/auth', auth);
app.use('/api/register', register);
app.use('/api/db', db);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  log.info(`server start on port: ${port}`);
});
