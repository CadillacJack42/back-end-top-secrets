const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class SecretServices {
  static async create({ title, description }) {
    console.log(title, description);
  }
};
