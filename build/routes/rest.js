"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

require("dotenv/config");

// this is going to be in memory tokenlist.. better to probably write this to a db
var tokenList = {};

var router = _express["default"].Router();

function processLogoutRequest(req, res) {
  if (req.cookies) {
    var refreshToken = req.cookies.refreshJwt;

    if (refreshToken in tokenList) {
      delete tokenList[refreshToken];
    }

    res.clearCookie('jwt');
    res.clearCookie('refreshJwt');
  }

  if (req.method === 'POST') {
    res.status(200).json({
      message: 'logged out',
      status: 200
    });
  } else if (req.method === 'GET') {
    res.sendFile('logout.html', {
      root: './public'
    }); // res.status(200).json({ message: 'logged out', status: 200 });
  } else {// throw an error
    }
}

router.get('/status', function (req, res) {
  res.cookie('tetsting', 'test');
  res.status(210).json({
    message: 'ok',
    status: 200
  });
});
router.post('/signup', _passport["default"].authenticate('signup', {
  session: false
}), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.status(200).json({
              message: 'signup was sucessful',
              status: 200
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/compute', function (req, res, next) {
  if (parseInt(req.body.value, 10) > 5) {
    res.json(req.body.value * 2);
  } else {
    next(new Error('testing 500s')); // res.json('value too low or something wrong')
  }
});
router.post('/login', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // eslint-disable-next-line consistent-return
            _passport["default"].authenticate('login', /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(error, user) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;

                        if (!error) {
                          _context2.next = 3;
                          break;
                        }

                        return _context2.abrupt("return", next(error));

                      case 3:
                        if (user) {
                          _context2.next = 5;
                          break;
                        }

                        return _context2.abrupt("return", next(new Error('email password required')));

                      case 5:
                        req.login(user, {
                          session: false
                        }, function (err) {
                          if (err) {
                            return next(error);
                          } // create jwt


                          var body = {
                            _id: user._id,
                            email: user.email,
                            username: user.username
                          };

                          var token = _jsonwebtoken["default"].sign({
                            user: body
                          }, process.env.JWT_SECRET, {
                            expiresIn: 900
                          });

                          var refreshToken = _jsonwebtoken["default"].sign({
                            user: body
                          }, process.env.JWT_REFRESH_SECRET, {
                            expiresIn: 86400
                          }); // store token in cookie


                          res.cookie('jwt', token);
                          res.cookie('refreshJwt', refreshToken); // store tokens in memory

                          tokenList[refreshToken] = {
                            token: token,
                            refreshToken: refreshToken,
                            email: user.email,
                            _id: user._id,
                            username: user.username
                          }; // send token back to user

                          return res.status(200).json({
                            token: token,
                            refreshToken: refreshToken,
                            status: 200
                          });
                        });
                        _context2.next = 12;
                        break;

                      case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2["catch"](0);
                        console.log("error: ".concat(_context2.t0));
                        return _context2.abrupt("return", next(_context2.t0));

                      case 12:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 8]]);
              }));

              return function (_x6, _x7) {
                return _ref3.apply(this, arguments);
              };
            }())(req, res, next);

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); // this will treat GET and POST the same.

router.route('/logout').get(processLogoutRequest).post(processLogoutRequest);
router.post('/token', function (req, res) {
  var refreshToken = req.body.refreshToken;

  if (refreshToken in tokenList) {
    var body = {
      email: tokenList[refreshToken].email,
      _id: tokenList[refreshToken]._id,
      username: tokenList[refreshToken].username
    };

    var token = _jsonwebtoken["default"].sign({
      user: body
    }, process.env.JWT_SECRET, {
      expiresIn: 300
    }); // update jwt


    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;
    res.status(200).json({
      token: token,
      status: 200
    });
  } else {
    res.status(401).json({
      message: 'unauthorized',
      status: 401
    });
  }
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=rest.js.map