const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { startGame, guessNumber } = require('./game');
const { commands } = require('./commands');
const { registerCommands } = require('./commands');  // Importation de la fonction d'enregistrement

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Bot est prêt !');
  registerCommands();  // Enregistre les commandes après que le bot est prêt
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('game!startgame')) {
    startGame(message.author);
    await message.reply('Le jeu de devinette a commencé!');
  }

  if (message.content.startsWith('game!guess')) {
    const args = message.content.split(' ');
    const result = guessNumber(message.author, args[1]);
    if (result.error) {
      await message.reply(result.error);
    } else if (result.success) {
      await message.reply(result.success);
    } else if (result.hint) {
      await message.reply(`Votre nombre est ${result.hint}.`);
    }
  }

  if (message.content.startsWith('game!commands')) {
    await message.reply('Les commandes disponibles sont: `game!startgame`, `game!guess [nombre]`, `game!commands`.');
  }
});

client.login(process.env.DISCORD_TOKEN);
