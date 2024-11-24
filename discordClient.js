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

// Écoute des messages
client.on('messageCreate', async (message) => {
  // Ignore les messages provenant du bot lui-même
  if (message.author.bot) return;

  // Vérifie si le message commence par le préfixe
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Commande help / commands
  if (command === 'help' || command === 'commands') {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Liste des commandes disponibles')
      .setDescription(
        '- `game!startgame` : Commencez un jeu de devinette\n' +
        '- `game!guess [nombre]` : Devinez un nombre entre 1 et 100\n' +
        '- `game!help` ou `game!commands` : Affiche la liste des commandes disponibles\n' +
        '- `game!dm <user_id> <message>` : Envoyez un message privé à un utilisateur'
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  // Commande startgame
  if (command === 'startgame') {
    startGame(message.author); // Démarre le jeu pour le joueur
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Jeu démarré!')
      .setDescription(`Un jeu de devinette a commencé ! ${message.author.username}, devinez un nombre entre 1 et 100.`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  // Commande guess
  if (command === 'guess') {
    const guess = args[0];
    const result = guessNumber(message.author, guess);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Résultat de la devinette')
      .setDescription(result.error || result.success || `Votre devinette est ${result.hint}.`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  // Commande dm
// Commande dm
if (command === 'dm') {
  const userMention = args[0]; // Le premier argument est la mention de l'utilisateur
  const dmMessage = args.slice(1).join(' '); // Le reste est le message à envoyer

  if (!userMention || !dmMessage) {
    return message.reply('Usage : `game!dm <@user> <message>`');
  }

  // Extraire l'ID de l'utilisateur de la mention (ex : <@439888146809749515> -> 439888146809749515)
  const userId = userMention.replace(/[<>@!]/g, '');

  try {
    console.log(`Tentative d'envoi de DM à l'utilisateur avec ID : ${userId}`);

    // Récupère l'utilisateur
    const user = await client.users.fetch(userId);

    if (!user) {
      return message.reply("Utilisateur introuvable. Vérifie l'ID fourni.");
    }

    // Envoie le message privé
    await user.send(dmMessage);
    message.reply(`Message envoyé avec succès à ${user.username} !`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du DM :', error);

    if (error.code === 50007) { // Code d'erreur spécifique : Can't DM this user
      return message.reply("Impossible d'envoyer le message. L'utilisateur a probablement désactivé les DMs.");
    }

    message.reply("Une erreur s'est produite lors de l'envoi du message.");
  }
}

});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);
