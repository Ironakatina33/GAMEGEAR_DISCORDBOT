const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is online!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');

const prefix = 'game!'; // Préfixe personnalisé
let secretNumber = null;
let players = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.MessageContent, 
  ],
  partials: ['CHANNEL'], // Nécessaire pour les DMs
});

// Commandes slash
const commands = [
  new SlashCommandBuilder().setName('startgame').setDescription('Commencez un jeu de devinette'),
  new SlashCommandBuilder().setName('guess').setDescription('Devinez un nombre entre 1 et 100')
    .addIntegerOption(option => option.setName('number').setDescription('Le nombre que vous devinez').setRequired(true)),
  new SlashCommandBuilder().setName('commands').setDescription('Liste de toutes les commandes disponibles')
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Enregistrement des commandes slash
(async () => {
  try {
    console.log('Enregistrement des commandes slash...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), 
      { body: commands.map(command => command.toJSON()) }
    );
    console.log('Commandes slash enregistrées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes:', error);
  }
})();

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  // Ignore les messages du bot lui-même
  if (message.author.bot) return;

  // Vérifie si le message commence par le préfixe personnalisé
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'startgame') {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    players = [message.author.id];

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Le jeu de devinette a commencé!')
      .setDescription('Devinez un nombre entre 1 et 100 en utilisant la commande `game!guess [nombre]`. Bonne chance !')
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  if (command === 'guess') {
    if (!secretNumber) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Aucun jeu en cours')
        .setDescription('Aucun jeu n\'a été lancé. Utilisez `game!startgame` pour commencer.')
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const guess = parseInt(args[0], 10);
    if (isNaN(guess)) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Entrée invalide')
        .setDescription('Veuillez entrer un nombre valide.')
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(guess === secretNumber ? 0x00ff00 : 0xffa500)
      .setTitle(guess === secretNumber ? 'Félicitations!' : 'Essaye encore!')
      .setDescription(
        guess === secretNumber
          ? `Félicitations ${message.author.tag}, vous avez deviné le bon nombre !`
          : `Votre guess est ${guess < secretNumber ? 'trop bas' : 'trop haut'}, essayez encore.`
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });

    if (guess === secretNumber) {
      secretNumber = null; // Réinitialiser le jeu
    }
  }

  // Commande pour lister toutes les commandes
  if (command === 'commands' || command === 'help') {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Liste des commandes disponibles')
      .setDescription(
        '- `game!startgame` : Commencez un jeu de devinette\n- `game!guess [nombre]` : Devinez un nombre entre 1 et 100\n- `game!commands` : Affiche la liste des commandes disponibles'
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
});

// Commandes slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'startgame') {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    players = [interaction.user.id];

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Le jeu de devinette a commencé!')
      .setDescription('Devinez un nombre entre 1 et 100 en utilisant la commande `/guess [nombre]`. Bonne chance !')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'guess') {
    if (!secretNumber) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Aucun jeu en cours')
        .setDescription('Aucun jeu n\'a été lancé. Utilisez `/startgame` pour commencer.')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    const guess = interaction.options.getInteger('number');
    if (guess === null) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Entrée invalide')
        .setDescription('Veuillez entrer un nombre valide.')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(guess === secretNumber ? 0x00ff00 : 0xffa500)
      .setTitle(guess === secretNumber ? 'Félicitations!' : 'Essaye encore!')
      .setDescription(
        guess === secretNumber
          ? `Félicitations ${interaction.user.tag}, vous avez deviné le bon nombre !`
          : `Votre guess est ${guess < secretNumber ? 'trop bas' : 'trop haut'}, essayez encore.`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    if (guess === secretNumber) {
      secretNumber = null; // Réinitialiser le jeu
    }
  }

  if (commandName === 'commands') {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Liste des commandes disponibles')
      .setDescription(
        '- `/startgame` : Commencez un jeu de devinette\n- `/guess [nombre]` : Devinez un nombre entre 1 et 100\n- `/commands` : Affiche la liste des commandes disponibles'
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
