require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./src/persistence/model/User");
const authRouter = require("./src/controller/AuthRouter");
const protectRoute = require("./src/controller/protectRoute");

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
    const user = (await User.findById(id)).toObject();
    done(null, user);
  } catch (e) {
    console.log("Cannot deserialize user!");
    done(e);
  }
})

const app = express();

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
  }));

  app.use(express.json());
  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      client: mongoose.connection.getClient()
    }),
    cookie:{
      secure: false,
      httpOnly: true,
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth", authRouter);

  app.get("/count", protectRoute, (req, res) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    req.session.count = req.session.count !== undefined ? req.session.count + 1 : 1;
    return res.json(
      {
        count: req.session.count
      }
    );
  });

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main().catch((e) => {
  console.log(e);
});
