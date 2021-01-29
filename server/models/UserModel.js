const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,// this doesn't seem to work
    lowercase: true, 
    trim: true
  },
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Date
  }
});


UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// this may be a bad idea because you need to create the user first i beleive to utilize this.. which defeats the purpose
// UserSchema.methods.usernameAvailable = async function (username) {
//   const user = await UserModel.findOne({ username: username});
//   if (user) {
//     return false; // name take
//   } else {
//     return true; // name available
//   }
//   // const compare = await bcrypt.compare(username, user.username);
//   // return compare;
// };

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = mongoose.model('user', UserSchema);


module.exports = UserModel;