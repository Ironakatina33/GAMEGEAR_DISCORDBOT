const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { startGame, guessNumber } = require('./game'); // Importer les fonctions de game.js

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

// Gestion des messages avec commandes préfixées
client.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore les messages des bots
  if (!message.content.startsWith(prefix)) return; // Ignore les messages sans préfixe

  // Extraction de la commande et des arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Commande Help
  if (command === 'help' || command === 'commands') {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Liste des commandes disponibles')
      .setDescription(
        '- `game!startgame` : Commencez un jeu de devinette\n' +
        '- `game!guess [nombre]` : Devinez un nombre entre 1 et 100\n' +
        '- `game!help` ou `game!commands` : Affiche la liste des commandes disponibles\n' +
        '- `game!dm <user_id> <message>` : Envoie un message privé à un utilisateur'
      )
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // Commande Startgame
  if (command === 'startgame') {
    startGame(message.author); // Démarre le jeu pour le joueur
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Jeu démarré!')
      .setDescription(
        `Un jeu de devinette a commencé ! ${message.author.username}, devinez un nombre entre 1 et 100.`
      )
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // Commande Guess
  if (command === 'guess') {
    const guess = args[0];
    const result = guessNumber(message.author, guess);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Résultat de la devinette')
      .setDescription(
        result.error || result.success || `Votre devinette est ${result.hint}.`
      )
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // Commande DM
  if (command === 'dm') {
    const userId = args[0]; // Le premier argument est l'ID de l'utilisateur
    const dmMessage = args.slice(1).join(' '); // Le reste est le message à envoyer

    if (!userId || !dmMessage) {
      return message.reply('Usage : `game!dm <user_id> <message>`');
    }

    try {
      const user = await client.users.fetch(userId); // Récupère l'utilisateur
      await user.send(dmMessage); // Envoie le message privé
      return message.reply(`Message envoyé à ${user.username} !`);
    } catch (error) {
      console.error(error);
      return message.reply('Impossible d\'envoyer le message. Vérifie l\'ID de l\'utilisateur.');
    }
  }
});

// Gestion des interactions slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'dm') {
    const user = interaction.options.getUser('utilisateur');
    const message = interaction.options.getString('message');

    try {
      await user.send(message); // Envoie le message privé
      await interaction.reply({ content: `Message envoyé à ${user.username} !`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Impossible d\'envoyer le message.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
