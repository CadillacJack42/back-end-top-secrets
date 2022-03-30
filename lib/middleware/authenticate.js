const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  //   console.log(req);
  try {
    const { session } = req.cookies;

    const payload = jwt.verify(session, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    error.message = 'You must be signed in to view this page';
    error.status = 401;
    next(error);
  }
};
