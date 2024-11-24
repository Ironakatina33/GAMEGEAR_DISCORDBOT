let secretNumber = null;
let players = [];

function startGame(player) {
  // Vérifie si une partie est déjà en cours
  if (secretNumber !== null) {
    return { error: 'Une partie est déjà en cours.' };
  }

  secretNumber = Math.floor(Math.random() * 100) + 1;
  players = [player.id];
  return { success: `${player.username} a démarré une nouvelle partie de devinette ! Devinez un nombre entre 1 et 100.` };
}

function guessNumber(player, guess) {
  if (secretNumber === null) {
    return { error: 'Aucun jeu en cours. Utilisez `game!startgame` pour commencer.' };
  }

  if (!players.includes(player.id)) {
    return { error: 'Vous n\'êtes pas dans la partie.' };
  }

  const guessInt = parseInt(guess, 10);
  if (isNaN(guessInt)) {
    return { error: 'Veuillez entrer un nombre valide.' };
  }

  if (guessInt === secretNumber) {
    secretNumber = null; // Réinitialise le jeu après une bonne réponse
    return { success: `${player.username} a deviné le bon nombre ! Félicitations !` };
  } else {
    return { hint: guessInt < secretNumber ? 'Trop bas' : 'Trop haut' };
  }
}

module.exports = { startGame, guessNumber };
