const {StatusCodes} = require("http-status-codes");
module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Request unauthorized!"
    });
  }
  next();
};
