require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(express.json());



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userSchema.methods.findLikeEmail = function () {
  return mongoose.model("User").find({
    email: this.email
  });
};

const User = mongoose.model("User", userSchema);


async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      client: mongoose.connection.getClient()
    })
  }));

  app.post("/test", (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });

  app.get("/count", (req, res) => {
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
