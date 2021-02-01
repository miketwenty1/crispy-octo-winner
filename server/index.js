import express from 'express';
import 'dotenv/config';

import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from 'passport';

// routes
import routes from './routes/rest';
import passwordRoutes from './routes/password';
import secureRoutes from './routes/secure';

// require passport auth
require('./auth/auth');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: process.env.CORS_ORIGIN,
}));
app.use(cookieParser());

console.log(mongoose.version);
// mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
console.log(uri);
const mongoConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
if (process.env.MONGO_USER_NAME && process.env.MONGO_PASSWORD) {
  mongoConfig.auth = { authSource: 'admin' };
  mongoConfig.user = process.env.MONGO_USER_NAME;
  mongoConfig.pass = process.env.MONGO_PASSWORD;
}
mongoose.connect(uri, mongoConfig);

mongoose.connection.on('error', (err) => {
  console.log(err);
  process.exit(1);
});

console.log(process.env.PORT);
const port = process.env.PORT || 3000;

// allow express to use files in public folder
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.send(`${__dirname}/index.html`);
});

// setup routes
app.use('/', routes);
app.use('/', passwordRoutes);
// secure routes secured by jwt
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.get('/game.html', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(req.user);
});

// catch all other routes (404's)

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
    status: 404,
  });
});

// handle errors

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 599).json({
    error: err.message,
    status: 599,
  });
});

mongoose.connection.on('connected', () => {
  console.log('connected to mongo');

  app.listen(port, () => {
    console.log(`running on port ${port}`);
  });
});
