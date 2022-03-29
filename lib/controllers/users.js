const { Router } = require('express');

// const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');

// const User = require('../models/User');
const UserServices = require('../services/UserServices.js');

const dayInMs = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserServices.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const userSessionToken = await UserServices.signIn(
        req.body.email,
        req.body.password
      );

      res
        .cookie(process.env.COOKIE_NAME, userSessionToken, {
          httpOnly: true,
          maxAge: dayInMs,
        })
        .json({ message: 'Successfully signed in!' });
    } catch (error) {
      next(error);
    }
  });
