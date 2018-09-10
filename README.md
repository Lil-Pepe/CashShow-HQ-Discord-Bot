# CashShow-HQ-Discord-Bot
This NodeJS based bot has been made to retrieve question best answers and send them into a Discord channel.
Fell free to modify it and enhance it.

## Install
```
$ git clone https://github.com/Lil-Pepe/CashShow-HQ-Discord-Bot
$ cd CashShow-HQ-Discord-Bot
$ npm install
```
When the bot is downloaded and installed, please edit the ```config.js``` and fill the ```token``` string corresponding to your Discord bot's token and the ```width``` integer corresponding to your screen width.

## Usage
The bot is quite easy to use :
- First, you need a software to cast your phone screen onto your computer, like [ApowerMirror](CashShow-HQ-Discord-Bot) or [AirDroid](https://web.airdroid.com/). It must be fast, to have as a little delay as possible.
- Open the ```app.js``` to edit the lines 186, 203 and 224 corresponding to the emplacement of each question on your screen in pixel and the line 245 corresponding to the question emplacement. To find the coordinates, you can use a software as MousePos. Take a screenshot of the questions and answers on the app to set everything up easier.
- Use ```node app``` in the bot folder to launch the bot.
- Invite the bot to your server.
- Use the trigger command set in the ```config.js``` file to trigger the bot.
Then the bot will send the answers after looking the Internet.

## Incoming changes/features
- Detect a tie between answers
- Better optical character recognition
- Less delay between trigger command and the sending in Discord
