// Fichier pour la configuration du client Discord
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { commands, registerCommands } = require('./commands');
const { startGame, makeGuess } = require('./game');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: ['CHANNEL'],
});

// Enregistrement des commandes Discord
registerCommands();

// Initialisation du client Discord et gestion des événements
client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.trim();

  if (content.startsWith('game!')) {
    const args = content.slice(5).split(' ');
    const command = args[0].toLowerCase();

    if (command === 'startgame') {
      startGame(message);
    }

    if (command === 'guess') {
      makeGuess(message, args[1]);
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === 'startgame') {
    startGame(interaction);
  }

  if (commandName === 'guess') {
    makeGuess(interaction, interaction.options.getInteger('number'));
  }
});

module.exports = { client };
