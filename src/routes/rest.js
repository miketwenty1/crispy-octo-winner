import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

// this is going to be in memory tokenlist.. better to probably write this to a db
const tokenList = {};

const router = express.Router();

// router.get('/', (req, res) => {
//   // console.log(req);
//   res.send('HAVE FUN STAYING POOR!');
// });
function processLogoutRequest(req, res) {
  if (req.cookies) {
    const refreshToken = req.cookies.refreshJwt;
    if (refreshToken in tokenList) {
      delete tokenList[refreshToken];
    }
    res.clearCookie('jwt');
    res.clearCookie('refreshJwt');
  }

  if (req.method === 'POST') {
    res.status(200).json({ message: 'logged out', status: 200 });
  } else if (req.method === 'GET') {
    res.sendFile('logout.html', { root: './public' });
    // res.status(200).json({ message: 'logged out', status: 200 });
  } else {
    // throw an error
  }
}
router.get('/status', (req, res) => {
  res.cookie('tetsting', 'test');
  res.status(210).json({
    message: 'ok',
    status: 200,
  });
});

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.status(200).json({ message: 'signup was sucessful', status: 200 });
  },
);

router.post('/compute', (req, res, next) => {
  if (parseInt(req.body.value, 10) > 5) {
    res.json(req.body.value * 2);
  } else {
    next(new Error('testing 500s')); // res.json('value too low or something wrong')
  }

  console.log(req.body);
});

router.post('/login', async (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('login', async (error, user) => {
    try {
      if (error) {
        return next(error);
      }
      if (!user) {
        return next(new Error('email password required'));
      }
      req.login(user, {
        session: false,
      }, (err) => {
        if (err) {
          return next(error);
        }

        // create jwt
        const body = {
          _id: user._id,
          email: user.email,
          name: user.username,
        };

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 300 });
        const refreshToken = jwt.sign({ user: body }, process.env.JWT_REFRESH_SECRET, { expiresIn: 86400 });
        // store token in cookie
        res.cookie('jwt', token);
        res.cookie('refreshJwt', refreshToken);
        // store tokens in memory
        tokenList[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
          name: user.name, // username
        };

        // send token back to user
        return res.status(200).json({
          token,
          refreshToken,
          status: 200,
        });
      });
    } catch (err) {
      console.log(`error: ${err}`);
      return next(err);
    }
  })(req, res, next);
});

// this will treat GET and POST the same.
router.route('/logout')
  .get(processLogoutRequest)
  .post(processLogoutRequest);

router.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken in tokenList) {
    const body = {
      email: tokenList[refreshToken].email,
      _id: tokenList[refreshToken]._id,
      name: tokenList[refreshToken].name,
    };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: 300 });
    // update jwt
    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;
    res.status(200).json({ token, status: 200 });
  } else {
    res.status(401).json({ message: 'unauthorized', status: 401 });
  }
});

export default router;
