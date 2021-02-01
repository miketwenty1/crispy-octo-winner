import passport from 'passport';
import localStrategy from 'passport-local';
import JwtStrategy from 'passport-jwt';
import UserModel from '../models/UserModel';

// passport.use(passport.initialize());
// passport.use(passport.session());
passport.use('signup', new localStrategy.Strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const { username } = req.body;
    const searchUser = await UserModel.findOne({ username });
    if (searchUser) {
      return done(new Error(`username ${username} taken`));
    }
    const user = await UserModel.create({ email, password, username });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use('login', new localStrategy.Strategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    // since email is unique this should only bring back one email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(new Error('User not found'), false);
    }
    const valid = await user.isValidPassword(password);
    if (!valid) {
      return done(new Error('Invalid Password'), false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// verify JWT token
passport.use(
  new JwtStrategy.Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.jwt;
      }
      return token;
    },
  },
  async (token, done) => {
    try {
      return done(null, token.user);
    } catch (err) {
      return done(err);
    }
  }),
);
