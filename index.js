const express = require('express'),
  app = express(),
  bunyan = require('bunyan'),
  uuid = require('uuid/v4'),
  session = require('express-session'),
  MySqlStore = require('express-mysql-session')(session);

// body parser
app.use(express.json());

const conn = require('./helpers/conn');

const session_store = new MySqlStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  },
  conn
);

app.use(
  session({
    genid: req => {
      return uuid();
    },
    secret: 'you_are_gay',
    cookie: { maxAge: 5000 },
    store: session_store,
    resave: false,
    saveUninitialized: false
  })
);

// logger
const log = bunyan.createLogger({ name: 'express' });

// routes
const auth = require('./routes/api/auth'),
  register = require('./routes/api/register'),
  upload = require('./routes/api/upload'),
  gallery = require('./routes/api/gallery'),
  photo = require('./routes/api/photo'),
  groups = require('./routes/api/groups');

app.use('/api/auth', auth);
app.use('/api/register', register);
app.use('/api/upload', upload);
app.use('/api/gallery', gallery);
app.use('/api/photo', photo);
app.use('/api/groups', groups);

app.use(express.static('public'));
// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log.info(`server start on port: ${port}`);
});
