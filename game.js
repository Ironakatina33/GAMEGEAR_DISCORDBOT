// Fichier pour la logique du jeu
let secretNumber = null;
let players = [];

function startGame(message) {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  players = [message.author.id];

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Le jeu de devinette a commencé!')
    .setDescription('Devinez un nombre entre 1 et 100 en utilisant la commande `game!guess [nombre]`. Bonne chance !')
    .setTimestamp();

  message.reply({ embeds: [embed] });
}

function makeGuess(message, guess) {
  if (!secretNumber) {
    return message.reply('Aucun jeu en cours. Utilisez `game!startgame` pour commencer.');
  }

  guess = parseInt(guess, 10);
  if (isNaN(guess)) {
    return message.reply('Veuillez entrer un nombre valide.');
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

  message.reply({ embeds: [embed] });

  if (guess === secretNumber) {
    secretNumber = null; // Réinitialiser le jeu
  }
}

module.exports = { startGame, makeGuess };
