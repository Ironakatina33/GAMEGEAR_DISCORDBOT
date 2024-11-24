// Fichier pour démarrer le serveur Express
const port = process.env.PORT || 3000;

function startServer(app) {
  app.get('/', (req, res) => {
    res.send('Bot is online!');
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = { startServer };
