import express from 'express';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import crypto from 'crypto';
import UserModel from '../models/UserModel';

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;
const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: email,
    pass: password,
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: '.bhs',
    defaultLayout: null,
    partialsDir: './templates/',
    layoutsDir: './templates/',
  },
  viewPath: path.resolve('./templates/'),
  extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const userEmail = req.body.email;
  const user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    res.status(400).json({
      message: 'invalid email', // should probably be a more generic email so people don't know what error condition they are hitting
      status: 400,
    });
    return;
  }

  // create reset token for user to reset their password
  const buffer = crypto.randomBytes(20);
  const token = buffer.toString('hex');
  // update user reset password token and expiration
  await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { resetToken: token, resetTokenExp: Date.now() + 3600000 }, // 1 hour

  );
  try {
    // send user password reset email
    const emailOptions = {
      to: userEmail,
      from: email,
      template: 'forgot-password',
      subject: 'Lumegume password reset',
      // this is what will populate variables in the email
      context: {
        name: user.username,
        url: `${process.env.SERVER_URL}:${process.env.PORT || 3000}/reset-password.html?token=${token}`,
      },
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({
      message: `An email has been sent to reset your password for: ${userEmail}, reset link is only valid for 10 minutes.`,
      status: 200,
    });
  } catch (err) {
    console.log(`forgot password didn't work ${err}`);
  }
  // }
});

router.post('/reset-password', async (req, res) => {
  const user = await UserModel.findOne({
    resetToken: req.body.token,
    resetTokenExp: { $gt: Date.now() }, // because im using date for this i can use gt (greater than values) ** only find token that aren't already expired
    // email: userEmail // i believe i can comment this out without any query problems because the token will be unique. big issue if duplicate tokens.
  });

  if (!user) {
    res.status(400).json({
      message: 'invalid token', // should probably be a more generic email so people don't know what error condition they are hitting
      status: 400,
    });
    return;
  }
  const userEmail = user.email;

  // make sure new password is provided and matches with a check
  if (!req.body.password || !req.body.verifiedPassword || req.body.password !== req.body.verifiedPassword) {
    res.status(400).json({
      message: 'passwords are not valid or do not match',
      status: 400,
    });
    return;
  }

  // update user model
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExp = undefined;
  await user.save(); // because user is a model using mongoose this will update the database

  // send user the update password template
  const emailOptions = {
    to: userEmail,
    from: email,
    template: 'reset-password',
    subject: 'Lumegume password reset confirmation',
    // this is what will populate variables in the email
    context: {
      name: user.username,
    },
  };
  await smtpTransport.sendMail(emailOptions);

  res.status(200).json({
    message: 'password updated',
    status: 200,
  });
});

export default router;
