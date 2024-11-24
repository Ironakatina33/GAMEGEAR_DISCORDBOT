const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { startGame, guessNumber } = require('./game');  // Importation des fonctions du fichier game.js

const prefix = 'game!'; // Définir un préfixe personnalisé

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.MessageContent, 
  ],
  partials: ['CHANNEL'], // Nécessaire pour les DMs
});

client.on('messageCreate', async message => {
  // Ignore les messages du bot lui-même
  if (message.author.bot) return;

  // Vérifie si le message commence par le préfixe personnalisé
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'help' || command === 'commands') {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Liste des commandes disponibles')
      .setDescription(
        '- `game!startgame` : Commencez un jeu de devinette\n- `game!guess [nombre]` : Devinez un nombre entre 1 et 100\n- `game!help` ou `game!commands` : Affiche la liste des commandes disponibles'
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  if (command === 'startgame') {
    const response = startGame(message.author);  // Démarrer une nouvelle partie
    if (response.error) {
      return message.reply(response.error);
    }
    message.reply(response.success);
  }

  if (command === 'guess') {
    const guess = args[0];
    const response = guessNumber(message.author, guess);  // Faire une supposition
    if (response.error) {
      return message.reply(response.error);
    }
    if (response.success) {
      return message.reply(response.success);
    }
    message.reply(response.hint);  // Indiquer si c'est trop bas ou trop haut
  }
});

client.login(process.env.DISCORD_TOKEN);
