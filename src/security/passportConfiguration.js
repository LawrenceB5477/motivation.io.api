const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../persistence/model/User");
const protectRoute = require("../router/util/protectRoute");

passport.use(new LocalStrategy({
  usernameField: "email"
}, async (email, password, done) => {
  try {
    const user = await User.findOne({email});
    if (!user) {
      return done(null, false, "User not found.");
    }
    if (!await bcrypt.compare(password, user.password)) {
      return done(null, false, "Password invalid.");
    }
    done(null, user.toObject());
  } catch (e) {
    console.log("Login attempt failed!");
    done(e);
  }
}));

passport.serializeUser((user, done) => {
  const userId = user._id.toString();
  done(null, userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    console.log("Cannot deserialize user!");
    done(e);
  }
});
