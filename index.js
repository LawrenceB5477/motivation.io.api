require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
const {client} = require("./src/service/quoteCacheService");
const authRouter = require("./src/router/AuthRouter");
const quoteRouter = require("./src/router/QuoteRouter")
const userRouter = require("./src/router/UserRouter");
require("./src/security/passportConfiguration");


async function main() {
  const app = express();
  await mongoose.connect(process.env.MONGODB_URL);
  await client.connect();

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
  app.use("/quote", quoteRouter);
  app.use("/user", userRouter);

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main().catch((e) => {
  console.log(e);
});
