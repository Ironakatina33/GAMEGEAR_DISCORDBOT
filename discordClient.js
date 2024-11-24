const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Définir le préfixe ici
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

// Ton code pour l'événement messageCreate
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

  // Autres commandes ici (startgame, guess, etc.)
});

  

client.login(process.env.DISCORD_TOKEN);
