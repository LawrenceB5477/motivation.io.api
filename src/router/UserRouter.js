const userRouter = require("express").Router();
const protectRoutes = require("./util/protectRoute");
const userService = require("../service/userService");

userRouter.use(protectRoutes);

userRouter.get("/stats", (req, res) => {
  const user = req.user;
  const ratedQuoteTotal = userService.getRatedQuoteTotal(user);
  const rateNumberTotals = userService.getRateNumberTotals(user);
  const tagTotals = userService.getTagTotals(user);

  res.json({
    ratedQuoteTotal,
    rateNumberTotals,
    tagTotals,
  });
});

module.exports = userRouter;
