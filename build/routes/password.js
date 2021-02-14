"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _nodemailerExpressHandlebars = _interopRequireDefault(require("nodemailer-express-handlebars"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

var email = process.env.EMAIL;
var password = process.env.EMAIL_PASSWORD;

var smtpTransport = _nodemailer["default"].createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: email,
    pass: password
  }
});

var handlebarsOptions = {
  viewEngine: {
    extName: '.bhs',
    defaultLayout: null,
    partialsDir: './templates/',
    layoutsDir: './templates/'
  },
  viewPath: _path["default"].resolve('./templates/'),
  extName: '.html'
};
smtpTransport.use('compile', (0, _nodemailerExpressHandlebars["default"])(handlebarsOptions));

var router = _express["default"].Router();

router.post('/forgot-password', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var userEmail, user, buffer, token, emailOptions;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userEmail = req.body.email;
            _context.next = 3;
            return _UserModel["default"].findOne({
              email: userEmail
            });

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            res.status(400).json({
              message: 'invalid email',
              // should probably be a more generic email so people don't know what error condition they are hitting
              status: 400
            });
            return _context.abrupt("return");

          case 7:
            // create reset token for user to reset their password
            buffer = _crypto["default"].randomBytes(20);
            token = buffer.toString('hex'); // update user reset password token and expiration

            _context.next = 11;
            return _UserModel["default"].findByIdAndUpdate({
              _id: user._id
            }, {
              resetToken: token,
              resetTokenExp: Date.now() + 3600000
            } // 1 hour
            );

          case 11:
            _context.prev = 11;
            // send user password reset email
            emailOptions = {
              to: userEmail,
              from: email,
              template: 'forgot-password',
              subject: 'Lumegume password reset',
              // this is what will populate variables in the email
              context: {
                name: user.username,
                url: "".concat(process.env.SERVER_URL, ":").concat(process.env.PORT || 3000, "/reset-password.html?token=").concat(token)
              }
            };
            _context.next = 15;
            return smtpTransport.sendMail(emailOptions);

          case 15:
            res.status(200).json({
              message: "An email has been sent to reset your password for: ".concat(userEmail, ", reset link is only valid for 10 minutes."),
              status: 200
            });
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            console.log("forgot password didn't work ".concat(_context.t0));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 18]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/reset-password', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var user, userEmail, emailOptions;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _UserModel["default"].findOne({
              resetToken: req.body.token,
              resetTokenExp: {
                $gt: Date.now()
              } // because im using date for this i can use gt (greater than values) ** only find token that aren't already expired
              // email: userEmail // i believe i can comment this out without any query problems because the token will be unique. big issue if duplicate tokens.

            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            res.status(400).json({
              message: 'invalid token',
              // should probably be a more generic email so people don't know what error condition they are hitting
              status: 400
            });
            return _context2.abrupt("return");

          case 6:
            userEmail = user.email; // make sure new password is provided and matches with a check

            if (!(!req.body.password || !req.body.verifiedPassword || req.body.password !== req.body.verifiedPassword)) {
              _context2.next = 10;
              break;
            }

            res.status(400).json({
              message: 'passwords are not valid or do not match',
              status: 400
            });
            return _context2.abrupt("return");

          case 10:
            // update user model
            user.password = req.body.password;
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            _context2.next = 15;
            return user.save();

          case 15:
            // because user is a model using mongoose this will update the database
            // send user the update password template
            emailOptions = {
              to: userEmail,
              from: email,
              template: 'reset-password',
              subject: 'Lumegume password reset confirmation',
              // this is what will populate variables in the email
              context: {
                name: user.username
              }
            };
            _context2.next = 18;
            return smtpTransport.sendMail(emailOptions);

          case 18:
            res.status(200).json({
              message: 'password updated',
              status: 200
            });

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=password.js.map