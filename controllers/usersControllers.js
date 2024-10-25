const db = require("../database")

exports.getAllUsers = function (req, res) {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
      });
    
}
exports.createNewUser = (req, res) => {
	// récupérer toutes les données qui arrivent dans le corps de la requête (body)
	const { firstName, lastName } = req.body

    // regex pour alphanumérique seulement
	function isAlphanumeric(str) {
		const regex = /^[a-zA-Z0-9]+$/
		return regex.test(str)
	}
    if (!firstName)
		return res.status(400).json({ error: "Le prenom est requis !" })
    if (typeof firstName !=="string")
		return res.status(400).json({ error: "Ce prenom est bizarre !" })
    if (!isAlphanumeric(firstName))
		return res.status(400).json({ error: "Ce nom n'est pas autorisé !" })
    if (!firstName || !lastName)
		return res
			.status(400)
			.json({ error: "Le prénom et le nom de famille sont requis !" })



    // exécute une requête sql
    db.run(
		"INSERT INTO users (firstName, lastName) VALUES (?, ?)",
		[firstName, lastName],
		function (err) {
			if (err) {
				res.status(500).json({ error: err.message })
			} else {
				res.status(201).json({ id: this.lastID, firstName })
			}
		}
	)
}

// POST mise à jour d'un utilisateur en fonction de son ID
exports.updateUser = (req, res) => {
	const { firstName, lastName } = req.body

	// Récupérer l'id des paramètres
	const userId = req.params.id

	// Vérifier les champs envoyés
	let updateFields = []
	let queryParams = []

	if (firstName) {
		updateFields.push("firstName = ?")
		queryParams.push(firstName)
	}

	if (lastName) {
		updateFields.push("lastName = ?")
		queryParams.push(lastName)
	}

	if (updateFields.length > 0) {
		// Ajouter userId aux paramètres de la requête
		queryParams.push(userId)

		// Construire la requête dynamiquement
		const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`

		db.run(query, queryParams, function (err) {
			if (err) {
				res.status(500).json({ error: err.message })
			} else if (this.changes === 0) {
				res.status(404).json({ message: "Utilisateur non trouvé" })
			} else {
				res.json({ msg: "Utilisateur mis à jour", userId, firstName, lastName })
			}
		})
	} else {
		res.status(400).json({ message: "Aucun champ à mettre à jour" })
	}
}
// Fonction pour supprimer un utilisateur de la base de données
exports.deleteUser = (req, res) => {
    // Récupérer l'identifiant (id) de l'utilisateur à supprimer à partir des paramètres de l'URL
    const { id } = req.params;

    // Exécuter la requête SQL pour supprimer l'utilisateur ayant cet identifiant
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        // Si une erreur survient lors de l'exécution de la requête
        if (err) {
            // Répondre avec un code de statut 500 et un message d'erreur
            res.status(500).json({ error: err.message });
        } 
        // Si aucun utilisateur n'a été trouvé avec cet identifiant (this.changes === 0)
        else if (this.changes === 0) {
            // Répondre avec un code de statut 404 et un message indiquant que l'utilisateur est introuvable
            res.status(404).json({ message: "User not found" });
        } 
        // Si l'utilisateur a été supprimé avec succès
        else {
            // Répondre avec un code de statut 200 et un message de confirmation
            res.status(200).json({ message: "User deleted!" });
        }
    });
};
