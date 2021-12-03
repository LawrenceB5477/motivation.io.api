const quoteCacheService = require("./quoteCacheService");
const quoteApi = require("../api/quoteApi");

const getSentimentDiff = (sentA, sentB) => {
  return Math.abs(sentA.score - sentB.score);
};

const getPossibleSimilarQuotes = async () => {
  const tags = await quoteCacheService.getQuoteTags();
  const randIndex = Math.floor(Math.random() * (tags.length));
  const tag = tags[randIndex];
  console.log(`Random tag is: ${tag}`);
  return await quoteApi.getQuoteByParams(
    {
      tags: tag,
      limit: process.env.SIMILAR_QUOTE_LIMIT
    }
  );
};

const getSimilarQuoteSentiments = async (ratedQuote, possibleSimilarQuotes) => {
  // TODO improve this
  const quoteSentiments = [];
  for (const quote of possibleSimilarQuotes) {
    if (quote._id !== ratedQuote._id) {
      const sent = await quoteCacheService.getQuoteSentiment(quote);
      quoteSentiments.push({
        quote,
        sentiment: sent
      });
    }
  }
  return quoteSentiments;
}

module.exports = {
  async getRandomQuote() {
    return quoteApi.getRandomQuote();
  },
  async getSimilarQuote(ratedQuote) {
    await quoteCacheService.getQuoteTags();
    const sentiment = await quoteCacheService.getQuoteSentiment(ratedQuote);

    const possibleSimilarQuotes = await getPossibleSimilarQuotes();
    console.log(`Similar quote count: ${possibleSimilarQuotes.length}`);
    const quoteSentiments = await getSimilarQuoteSentiments(ratedQuote, possibleSimilarQuotes);


    let mostSimilarQuoteIndex = {index: 0, difference: getSentimentDiff(sentiment, quoteSentiments[0].sentiment)};
    for (let i = 1; i < quoteSentiments.length; i++) {
      const sentDiff = getSentimentDiff(sentiment, quoteSentiments[i].sentiment);
      if (sentDiff < mostSimilarQuoteIndex.difference) {
        mostSimilarQuoteIndex = {
          index: i,
          difference: sentDiff
        };
      }
    }

    const mostSimilarQuote = quoteSentiments[mostSimilarQuoteIndex.index];

    // console.log(quoteSentiments);
    console.log("-------- Metrics -----------")
    console.log("- Rated quote");
    console.log({...ratedQuote, sentiment});
    console.log("- Most Similar Quote");
    console.log(mostSimilarQuote);
    console.log("- Difference");
    console.log(mostSimilarQuoteIndex);
    console.log("-----------------------------")
    return  mostSimilarQuote.quote;
  }
};
