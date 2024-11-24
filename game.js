let secretNumber = null;
let players = [];

function startGame(player) {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  players = [player.id];
}

function guessNumber(player, guess) {
  if (!secretNumber) {
    return { error: 'Aucun jeu en cours. Utilisez startgame pour commencer.' };
  }

  const guessInt = parseInt(guess, 10);
  if (isNaN(guessInt)) {
    return { error: 'Veuillez entrer un nombre valide.' };
  }

  if (guessInt === secretNumber) {
    secretNumber = null; // Réinitialise le jeu après une bonne réponse
    return { success: `${player.username} a deviné le bon nombre ! Félicitations !` };
  } else {
    return { hint: guessInt < secretNumber ? 'trop bas' : 'trop haut' };
  }
}

module.exports = { startGame, guessNumber };
