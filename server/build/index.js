"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

require("dotenv/config");

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _rest = _interopRequireDefault(require("./routes/rest"));

var _password = _interopRequireDefault(require("./routes/password"));

var _secure = _interopRequireDefault(require("./routes/secure"));

var _GameManager = _interopRequireDefault(require("./game_manager/GameManager"));

// routes
// require passport auth
require('./auth/auth');

var app = (0, _express["default"])();

var server = require('http').Server(app);

var io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST']
  }
});

var gameManager = new _GameManager["default"](io);
gameManager.setup();
console.log(process.env.PORT);
var port = process.env.PORT || 3000; // parse application/x-www-form-urlencoded

app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // parse application/json

app.use(_bodyParser["default"].json());
app.use((0, _cors["default"])({
  credentials: true,
  origin: process.env.CORS_ORIGIN
}));
app.use((0, _cookieParser["default"])());
console.log(_mongoose["default"].version); // mongo connection

var uri = process.env.MONGO_CONNECTION_URL;
console.log(uri);
var mongoConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

if (process.env.MONGO_USER_NAME && process.env.MONGO_PASSWORD) {
  mongoConfig.auth = {
    authSource: 'admin'
  };
  mongoConfig.user = process.env.MONGO_USER_NAME;
  mongoConfig.pass = process.env.MONGO_PASSWORD;
}

_mongoose["default"].connect(uri, mongoConfig);

_mongoose["default"].connection.on('error', function (err) {
  console.log(err);
  process.exit(1);
}); // allow express to use files in public folder


app.use(_express["default"]["static"]("".concat(__dirname, "/../public")));
app.get('/', function (req, res) {
  res.send("".concat(__dirname, "/../index.html"));
}); // setup routes

app.use('/', _rest["default"]);
app.use('/', _password["default"]); // secure routes secured by jwt

app.use('/', _passport["default"].authenticate('jwt', {
  session: false
}), _secure["default"]);
app.get('/game.html', _passport["default"].authenticate('jwt', {
  session: false
}), function (req, res) {
  res.status(200).json(req.user);
}); // catch all other routes (404's)

app.use(function (req, res) {
  res.status(404).json({
    message: 'Not Found',
    status: 404
  });
}); // handle errors
// eslint-disable-next-line no-unused-vars

app.use(function (err, req, res, next) {
  res.status(err.status || 599).json({
    error: err.message,
    status: 599
  });
});

_mongoose["default"].connection.on('connected', function () {
  console.log('connected to mongo');
  server.listen(port, function () {
    console.log("running on port ".concat(port));
  });
});
//# sourceMappingURL=index.js.map