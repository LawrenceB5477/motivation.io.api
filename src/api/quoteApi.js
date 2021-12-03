const axios = require("axios");

const quoteApi = axios.create({
  baseURL: process.env.QUOTE_API
});

module.exports = {
  async qetQuoteTags() {
    const res = await quoteApi.get("/tags");
    return res.data.map((data) => data.name);
  },
  async getRandomQuote() {
    const randomQuoteRes = await quoteApi.get("/random");
    return randomQuoteRes.data;
  },
  async getQuoteByParams(params) {
    const res = await quoteApi.get("/quotes", {
      params
    });
    return res.data.results
  }
}
