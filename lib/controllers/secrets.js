const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const secrets = await Secret.getAll();
      res.send(secrets);
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const secret = await Secret.create(req.body.title, req.body.description);
      res.send(secret);
    } catch (error) {
      next(error);
    }
  });
