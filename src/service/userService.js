const User = require("../persistence/model/User");

module.exports = {
  getRatedQuoteTotal(user) {
    return user.quotes.length;
  },
  getRateNumberTotals(user) {
    const values = [0, 0, 0, 0, 0];
    for (const quote of user.quotes) {
      values[quote.rating - 1]++;
    }
    return values;
  },
  // This could be combined with above if performance slowed
  getTagTotals(user) {
    const tagTotals = {};
    for (const quote of user.quotes) {
      for (const tag of quote.tags) {
        if (tag in tagTotals) {
          tagTotals[tag]++;
        } else {
          tagTotals[tag] = 1;
        }
      }
    }
    const max = Object.entries(tagTotals).reduce((max, current) => {
      if (current[1] > max[1]) {
        return current;
      } else {
        return max;
      }
    }, ["", 0]);

    return {
      tagTotals,
      max: max[0],
    };
  }
};
