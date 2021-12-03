const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

module.exports = {
  async analyzeQuoteSentiment(quote) {
    const document = {
      content: quote.content,
      type: "PLAIN_TEXT",
    };
    const [result] = await client.analyzeSentiment({document});
    const sentiment = result.documentSentiment;
    return sentiment;
  }
}
