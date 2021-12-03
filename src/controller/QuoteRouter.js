const quoteRouter = require("express").Router();
const protectRoutes = require("./protectRoute");
const quoteService = require("../service/quoteService");
const {StatusCodes} = require("http-status-codes");
const User = require("../persistence/model/User");

quoteRouter.use(protectRoutes);

quoteRouter.post("/rate", async (req, res) => {
  const user = req.user;
  const {quote, rating} = req.body;
  const quoteData = {
    _id: quote._id,
    author: quote.author,
    authorSlug: quote.authorSlug,
    tags: quote.tags,
    rating
  };
  try {
    let existingQuoteIndex = -1;
    for (let i = 0; i < user.quotes.length; i++) {
      const q = user.quotes[i];
      if (q._id === quote._id) {
        existingQuoteIndex = i;
        break;
      }
    }
    if (existingQuoteIndex > -1) {
      user.quotes[existingQuoteIndex] = quoteData;
    } else {
      user.quotes.push(quoteData);
    }
    await user.save();
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error trying to save quote!"
    })
  }

  let newQuote = null;
  if (rating >= 4) {
    // get similar quote

    try {
      newQuote = await quoteService.getSimilarQuote(quote);
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error trying to fetch a new quote"
      })
    }

  } else {
    try {
      newQuote = await quoteService.getRandomQuote();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error trying to fetch a new quote"
      })
    }
  }
  res.json({
    savedQuote: quoteData,
    quote: newQuote
  });
});

module.exports = quoteRouter;
