require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST } = require('discord.js');

const prefix = 'game!'; // Préfixe personnalisé
let secretNumber = null;
let players = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Gérer les serveurs
    GatewayIntentBits.GuildMessages, // Gérer les messages dans les serveurs
    GatewayIntentBits.DirectMessages, // Gérer les messages privés
    GatewayIntentBits.MessageContent, // Lire le contenu des messages
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
      '/applications/{client_id}/commands',
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
    await message.reply('Le jeu a commencé ! Devinez un nombre entre 1 et 100 en utilisant la commande `bot!guess [nombre]`.');
  }

  if (command === 'guess') {
    if (!secretNumber) {
      return message.reply('Aucun jeu n\'a été lancé. Utilisez `bot!startgame` pour commencer.');
    }

    const guess = parseInt(args[0], 10);
    if (isNaN(guess)) {
      return message.reply('Veuillez entrer un nombre valide.');
    }

    if (guess === secretNumber) {
      await message.reply(`Félicitations ${message.author.tag}, vous avez deviné le bon nombre !`);
      secretNumber = null; // Réinitialiser le jeu
    } else {
      await message.reply(guess < secretNumber ? 'Trop bas ! Essayez encore.' : 'Trop haut ! Essayez encore.');
    }
  }

  // Commande pour lister toutes les commandes
  if (command === 'commands' || command === 'help') {
    await message.reply('Voici les commandes disponibles :\n- `bot!startgame` : Commencez un jeu de devinette\n- `bot!guess [nombre]` : Devinez un nombre entre 1 et 100\n- `bot!commands` : Affiche la liste des commandes disponibles');
  }
});

// Commandes slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'startgame') {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    players = [interaction.user.id];
    await interaction.reply('Le jeu a commencé ! Devinez un nombre entre 1 et 100 en utilisant la commande `/guess [nombre]`.');
  }

  if (commandName === 'guess') {
    if (!secretNumber) {
      return interaction.reply('Aucun jeu n\'a été lancé. Utilisez `/startgame` pour commencer.');
    }

    const guess = interaction.options.getInteger('number');
    if (guess === null) {
      return interaction.reply('Veuillez entrer un nombre valide.');
    }

    if (guess === secretNumber) {
      await interaction.reply(`Félicitations ${interaction.user.tag}, vous avez deviné le bon nombre !`);
      secretNumber = null; // Réinitialiser le jeu
    } else {
      await interaction.reply(guess < secretNumber ? 'Trop bas ! Essayez encore.' : 'Trop haut ! Essayez encore.');
    }
  }

  if (commandName === 'commands') {
    await interaction.reply('Voici les commandes disponibles :\n- `/startgame` : Commencez un jeu de devinette\n- `/guess [nombre]` : Devinez un nombre entre 1 et 100\n- `/commands` : Affiche la liste des commandes disponibles');
  }
});

client.login(process.env.DISCORD_TOKEN);
