const authRouter = require("express").Router();
const {StatusCodes} = require("http-status-codes");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../persistence/model/User");



authRouter.post("/create",async (req, res) => {
  // TODO add validation
  const createRequest = req.body;
  if (await User.findOne({ email: createRequest.email})) {
    return res.status(StatusCodes.FORBIDDEN).json(
      {
        message: "A user with this email already exists!"
      }
    );
  }

  if (createRequest.password !== createRequest.confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Passwords do not match!"
    });
  }

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(createRequest.password, salt);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    })
    await user.save();
    const userObject = user.toObject();
    req.login(userObject, (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User not logged in",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "User created successfully",
        user: {
          email: userObject.email,
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "User creation failed!"
    });
  }
});

authRouter.post("/login", async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User is already logged in"
    });
  }
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({message: info});
    }
    // TODO look at this
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Successful login!",
        user: {
          email: user.email,
        }
      });
    });
  })(req, res, next);
});

authRouter.post("/logout", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User is not logged in"
    });
  }
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Session unable to be destroyed",
        });
    }
    return res.json({
      message: "Logged out successfully"
    });
  })

});

authRouter.post("/forgot", (req, res) => {

});

authRouter.post("/reset-password", (req, res) => {

});

module.exports = authRouter;
