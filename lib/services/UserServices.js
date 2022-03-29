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
};
