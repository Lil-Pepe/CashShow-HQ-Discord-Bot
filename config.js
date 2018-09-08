var config = {
  userId: '272057552710139914', //Your Discord user ID
  command: '-g', // Bot trigger command
  token: '', //Discord bot token
  width: 1920, //Width of your screen
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  d: [],
  p: [0, 0, 0], //Defining the
  notWords: ['not', 'n\'est pas', 'kein', 'keine', 'keinen', 'n\'à', 'n\'a', 'nicht', 'none', 'jamais', 'never', 'nie', 'niemals', 'nowhere'], //Negative words
  ignoreList: ['des', 'les', 'his', 'and', 'her', 'der', 'die', 'das', 'als', 'the', 'une', 'ein'] // Words to ignore
};

module.exports = config;
