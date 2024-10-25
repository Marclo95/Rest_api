// Importation des modules nécessaires
const express = require('express');
const app = express();
const port = 3000; // Définition du port d'écoute

// Importation du routeur pour les utilisateurs depuis le fichier users.js
const usersRouter = require("./routes/users.js");

// Importation et configuration de la base de données SQLite
const sqlite3 = require("sqlite3").verbose();

// Ouverture de la connexion à la base de données
const db = new sqlite3.Database("./users.db", (err) => {
	if (err) {
		// Affiche une erreur si la connexion échoue
		console.error("Erreur d'ouverture de la base de données :", err.message);
	} else {
		console.log("Connecté à la base de données SQLite.");

		// Création de la table users si elle n'existe pas
		db.run(
			`CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				firstName TEXT NOT NULL,
				lastName TEXT NOT NULL
			)`,
			(err) => {
				if (err) {
					// Affiche une erreur si la création de table échoue
					console.error("Erreur lors de la création de la table :", err.message);
				}
			}
		);
	}
});

// Exportation de la base de données pour pouvoir l'utiliser dans d'autres fichiers
module.exports = db;

// MIDDLEWARE pour analyser le JSON dans les requêtes
app.use(express.json());

// Point de terminaison pour les utilisateurs (défini dans le routeur usersRouter)
app.use("/api/", usersRouter);

// Route de base qui affiche un message de bienvenue
app.get("/", (req, res) => {
    res.json({
		msg: "Bienvenue dans mon API utilisateur",
	});
});

// Démarrage du serveur et écoute sur le port spécifié
app.listen(port, () => {
	console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
