const { SlashCommandBuilder, REST, Routes } = require('discord.js');

// Définir les commandes
const commands = [
  new SlashCommandBuilder().setName('startgame').setDescription('Commencez un jeu de devinette'),
  new SlashCommandBuilder().setName('guess').setDescription('Devinez un nombre entre 1 et 100')
    .addIntegerOption(option => option.setName('number').setDescription('Le nombre que vous devinez').setRequired(true)),
  new SlashCommandBuilder().setName('commands').setDescription('Liste de toutes les commandes disponibles'),
  new SlashCommandBuilder()
  .setName('dm')
  .setDescription('Envoie un message privé à un utilisateur')
  .addUserOption(option => 
    option.setName('utilisateur')
          .setDescription('Utilisateur à qui envoyer un message')
          .setRequired(true))
  .addStringOption(option => 
    option.setName('message')
          .setDescription('Le message à envoyer')
          .setRequired(true)),
];

// Créer la fonction registerCommands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
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
}

// Exporter les commandes et la fonction registerCommands
module.exports = { commands, registerCommands };
