require('dotenv').config();  // Charge les variables d'environnement

const app = require('./server');  // Démarre le serveur Express
require('./discordClient');  // Démarre le bot Discord

console.log('Bot et serveur Express démarrés.');
