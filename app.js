const config = require('./config.js'); //Including the config file
var screenshot = require('desktop-screenshot'), //Including the module that take a screenshot of your desktop
gm = require('gm'), //Including the module that crops the screenshot of your Desktop
nodecr = require('nodecr'), //Including the OCR = Image to text
request = require('request'), //Including the request module
d = [], //
p = [0, 0, 0],
wbw = [], // Percentage per answer array
bodGoogle, // toLowerCase google question html code
bodBing,
question, // String question
answers = [0, 0, 0], // Every ansswers contained in an array
pointsAnswer = [0, 0, 0],
notQ = 0;

var async = require("async"); // Including async module

const Discord = require('discord.js'); //Including Discord.js lib
const client = new Discord.Client(); //Creating the Discord Client

client.on('ready', msg => { // When the bot is connected
  console.log('Bot prêt a OCR'); // Logging
});

client.on('message', msg => { // on Discord message event
  if (msg.content === config.command) { // If the message contains  the trigger command
    if (msg.author.id === config.userId) { //If the message author ID is the userId contained in the config.js file
      console.log('Deleting message'); // Logging the message deletion
      msg.delete(); // Deleting the message
      console.log('Taking screenshot'); //Logging the screenshot event
      screenshot("screenshot.jpg", {width: config.width}, function(error, complete) { // Screenshoting
        async.parallel({
          answerOne: screenA0.bind(null),
          answerTwo: screenA1.bind(null),
          answerThree: screenA2.bind(null),
          question: screenQ.bind(null)
        }, function(error, results) {

          if (results.question.slice(-1) === '?' || results.question.slice(-1) === '2') { // If the last caracter of the question is '?' or '2'
            question = results.question.substring(0, results.question.length-1); // Deleting the last caracter
          } else {
            question = results.question //Defining the question varaible to the ocr result
          }

          // Including every answers in the answers array
          answers = [
            results.answerOne.toLowerCase().trim(),
            results.answerTwo.toLowerCase().trim(),
            results.answerThree.toLowerCase().trim()
          ];

          console.log('Question : ', results.question); //Logging the question
          console.log('Réponses : ', answers); //Logging every answers

          request(config.google+question.replace(/\s/gm, '%20'), function(error, response, body) { //Google request
            console.log('Recherche Google : ', config.google+results.question.replace(/\s/gm, '%20')); //Logging the link of  the google request
            bodGoogle = body.toLowerCase(); //Convert the Google request body to lower case
            request(config.bing+question.replace(/\s/gm, '%20'), function(error, response, body) { //Bing request
              console.log('Recherche Bing : ', config.bing+results.question.replace(/\s/gm, '%20')); //Logging the link of  the bing request
              bodBing = body.toLowerCase(); //Convert the Bing request body to lower case

              //Splitting the answers every ' ' to create an array that contains every words of each answers
              words = [
                answers[0].toLowerCase().trim().split(' '),
                answers[1].toLowerCase().trim().split(' '),
                answers[2].toLowerCase().trim().split(' ')
              ];

              console.log('[INFO] Mots par mots : ', words); //Logging every words of each answers

              // Check if answers match with the requests bodies word by word
              for (i=0;i < words.length; i++) {
                for (t=0;t < words[i].length; t++) {
                  if (words[i][t].length <= 2) { // If the string length is < 2
                  } else {
                    if (config.ignoreList.some(word => words[i][t].toLowerCase().includes(word))) { // If the word is contained in the ignore list
                    } else {
                      wbw[i] = (bodGoogle.match(new RegExp(words[i][t], 'gm')) || []).length
                      pointsAnswer[i] = (bodGoogle.match(new RegExp(words[i][t], 'gm')) || []).length+(bodGoogle.match(new RegExp(answers[i], 'gm')) || []).length*3+(bodBing.match(new RegExp(answers[i], 'gm')) || []).length*3;
                    }
                  }
                }
              }
              var c = [
                (bodGoogle.match(new RegExp(answers[0], 'gm')) || []).length, // Check if the whole answer is contained in the bodies
                (bodGoogle.match(new RegExp(answers[1], 'gm')) || []).length,
                (bodGoogle.match(new RegExp(answers[2], 'gm')) || []).length,
                (bodBing.match(new RegExp(answers[0], 'gm')) || []).length,
                (bodBing.match(new RegExp(answers[1], 'gm')) || []).length,
                (bodBing.match(new RegExp(answers[2], 'gm')) || []).length
              ];
              console.log(`Points par réponses (Google, Bing, WBW) : [${c[0]}, ${c[3]}, ${wbw[0]}], [${c[1]}, ${c[4]}, ${wbw[1]}], [${c[2]}, ${c[5]}, ${wbw[2]}]`);
              console.log(`Total des points : ${pointsAnswer}`); //Logging the total of points

              var sQ = '(Source)['+results.question.replace(/\s/gm, '%20')+']';

              d = [ // Creating the texts that will be send in the embed's answers field
                `1 - [${answers[0]}](${config.google}${answers[0].replace(/\s/gm, '%20')})`,
                `2 - [${answers[1]}](${config.google}${answers[1].replace(/\s/gm, '%20')})`,
                `3 - [${answers[2]}](${config.google}${answers[2].replace(/\s/gm, '%20')})`
              ];

              tot = pointsAnswer[0] + pointsAnswer[1] + pointsAnswer[2]; // Defining the total of points

              if (tot === 0) {
                for (i = 0;i < p.length; i++) {
                  p[i] = 0;
                }
              } else {
                for (i = 0;i < p.length; i++) {
                  p[i] = pointsAnswer[i]*100/tot; //Calculating the probabilities in %
                }
              }

              console.log('Probabilités : ', p);

              if (config.notWords.some(word => question.toLowerCase().includes(word))) { //If it's a NOT question
                var id = p.findIndex(x => x == Math.min(...p))

                var embed = new Discord.RichEmbed() //Creating the embed to send
                .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                .setColor('#FF0500')
                .setTitle(question)
                .addField('Réponses', `${d[0]}\n${d[1]}\n${d[2]}`, true)
                .addField('Probabilités', `${p[0].toFixed(2)}%\n${p[1].toFixed(2)}%\n${p[2].toFixed(2)}%`, true)

                if (tot === 0) { // If no point, the answer is a tie
                  embed.addField('Meilleure réponse', " 🤷 ", true)
                } else {
                  embed.addField('Meilleure réponse', `**${answers[id]}**`, true)
                }

                embed.addField('Requêtes Google :', '[Source](https://www.google.com/search?q='+results.question.replace(/\s/gm, '%20')+')')
                .setDescription('Cette question contient un __**NOT**__, ce qui signifie que la réponse avec le moins de résultat est la plus probable')
                .setFooter('Les résultats de ce robot peuvent ne pas être justes/The results of this bot can be not true')
                msg.channel.send(embed).catch(err => {
                  console.error(err);
                })
              } else { //If it's not a NOT question
                var id = p.findIndex(x => x == Math.max(...p))

                var embed = new Discord.RichEmbed() //Creating the embed to send
                .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                .setColor('#FF0500')
                .setTitle(question)
                .addField('Réponses', `${d[0]}\n${d[1]}\n${d[2]}`, true)
                .addField('Probabilités', `${p[0].toFixed(2)}% **(${pointsAnswer[0]})**\n${p[1].toFixed(2)}% **(${pointsAnswer[1]})**\n${p[2].toFixed(2)}% **(${pointsAnswer[2]})**`, true)
                if (tot === 0) {
                  embed.addField('Meilleure réponse', " ¯\\_(ツ)_/¯ ", true)
                } else {
                  embed.addField('Meilleure réponse', `**${answers[id]}**`, true)
                }
                embed.addField('Requêtes Google :', '[Source](https://www.google.com/search?q='+results.question.replace(/\s/gm, '%20')+')')
                .setDescription('Question classique')
                .setFooter('Les résultats de ce robot peuvent ne pas être justes/The results of this bot can be not true')
                msg.channel.send(embed).catch(err => {
                  console.error(err);
                })
                console.log('Remise à zéro...')
                pointsAnswer = [0, 0, 0]; //reseting the points per answers array
                p = [0, 0, 0]; //Reseting the probability array
                c = [0, 0, 0];
              }
            });
          });
        });
      });
    }
  }
});

var screenA0 = function(callback) { // Function that Screen and OCR the answer1
  gm('screenshot.jpg') // Creating the Answers screenshot
  .crop('295','56', '1507', '412')// Answers 3 croping, cursor position
  .write('q1.jpg', function (err) {
    if (err) {
      console.log(err);
      msg.reply('Erreur, voir la console');
    }
    else {
      nodecr.process('q1.jpg',function(err, texte) {
        answers[0] = texte.replace(/\n/gm, '').toLowerCase();
        callback(null, answers[0]);
      });
    }
  });
}

var screenA1 = function(callback)  { // Function that Screen and OCR the answer2
  gm('screenshot.jpg') // Creating the Answers screenshot
  .crop('295','56', '1507', '493') // Answers 2 croping, cursor position
  .write('q2.jpg', function (err)
  {
    if (err)
    {
      console.log(err);
      msg.reply('Erreur, voir la console');
    }
    else
    {
      nodecr.process('q2.jpg',function(err, texte)
      {
        answers[1] = texte.replace(/\n/gm, '').toLowerCase();
        callback(null, answers[1]);
      });
    }
  });
}

var screenA2 = function(callback) { // Function that Screen and OCR the answer3
  gm('screenshot.jpg') // Creating the Answers screenshot
  .crop('295','56', '1507', '571')// Answers 3 croping, cursor position
  .write('q3.jpg', function (err)
  {
    if (err)
    {
      console.log(err);
      msg.reply('Erreur, voir la console');
    }
    else
    {
      nodecr.process('q3.jpg',function(err, texte)
      {
        answers[2] = texte.replace(/\n/gm, '').toLowerCase();
        callback(null, answers[2]);
      });
    }
  });
}

var screenQ = function(callback)  { // Function that Screen and OCR the Question
  gm('screenshot.jpg') // Creating the Answers screenshot
  .crop('359', '95', '1476', '255')// Question croping, cursor position
  .write('question.jpg', function (err) {
    if (err) {
      console.log(err);
      msg.reply('Erreur, voir la console');
    } else {
      nodecr.process('question.jpg',function(err, texte)
      {
        question = texte.replace(/\s/gm, " ");
        callback(null, question.trim());
      });
    }
  });
}

client.login(config.token);
