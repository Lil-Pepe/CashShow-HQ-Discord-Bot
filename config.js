var config = {
  userId: 'YOUR_DISCORD_USER_ID', //Your Discord user ID
  command: '-g', // Bot trigger command
  token: 'DISCORD_BOT_TOKEN', //Discord bot token
  width: 1920, //Width of your screen
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  notWords: ['not', 'n\'est pas', 'kein', 'keine', 'keinen', 'n\'à', 'n\'a', 'nicht', 'none', 'jamais', 'never', 'nie', 'niemals', 'nowhere'], //Negative words
  ignoreList: ['des', 'les', 'his', 'and', 'her', 'der', 'die', 'das', 'als', 'the', 'une', 'ein'] // Words to ignore
};

module.exports = config;
