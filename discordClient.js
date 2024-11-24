const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { startGame, guessNumber } = require('./game');
const { commands } = require('./commands');
const { registerCommands } = require('./commands'); // Assure-toi du bon chemin


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    registerCommands();  // Enregistre les commandes après que le bot est prêt
  });
  

  client.on('messageCreate', async message => {
    // Ignore les messages du bot lui-même
    if (message.author.bot) return;
  
    // Vérifie si le message commence par le préfixe personnalisé
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    // Commande pour afficher les commandes disponibles
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
