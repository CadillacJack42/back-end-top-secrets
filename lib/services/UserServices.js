const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserServices {
  static async create({ first_name, last_name, email, password }) {
    const hashWord = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      first_name,
      last_name,
      email,
      password: hashWord,
    });
    return user;
  }

  static async signIn(email, password) {
    try {
      const user = await User.getByEmail(email);
      if (!user)
        throw new Error('Invalid sign in attempt. Check Email and Password');

      if (!bcrypt.compareSync(password, user.userPassword)) {
        throw new Error('Invalid sign in attempt. Check Email and Password');
      }

      const userToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      // console.log('USER TOKEN : ', userToken);
      return userToken;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
