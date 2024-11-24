const { SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('startgame').setDescription('Commencez un jeu de devinette'),
  new SlashCommandBuilder().setName('guess').setDescription('Devinez un nombre entre 1 et 100')
    .addIntegerOption(option => option.setName('number').setDescription('Le nombre que vous devinez').setRequired(true)),
  new SlashCommandBuilder().setName('commands').setDescription('Liste de toutes les commandes disponibles')
];

module.exports = { commands };
