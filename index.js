// Importation des modules nécessaires
const express = require('express');
const app = express();
const { startServer } = require('./server');
const { client } = require('./discordClient');

// Initialisation du serveur Express
startServer(app);

// Connexion du bot Discord
client.login(process.env.DISCORD_TOKEN);
