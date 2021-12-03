const {createClient} = require("redis");
const naturalLanguageService = require("./naturalLanguageService");
const quoteApi = require("../api/quoteApi");

const client = createClient({
  url: process.env.REDIS_URL
});

module.exports = {
  client,
  async getQuoteTags() {
    let tagSet = await client.sMembers("tags");
    if (tagSet.length === 0) {
      const tags = await quoteApi.qetQuoteTags();
      tagSet = tags;
      await client.sAdd("tags", tags);
    }
    return tagSet;
  },
  async getQuoteSentiment(quote) {
    const id = quote._id;
    const cachedSentiment = await client.get(id);
    if (cachedSentiment === null) {
      const sentiment = await naturalLanguageService.analyzeQuoteSentiment(quote);
      await client.set(id, JSON.stringify(sentiment));
      return sentiment;
    } else {
      // console.log("Retrieved from cache!");
      return JSON.parse(cachedSentiment);
    }
  },
}
