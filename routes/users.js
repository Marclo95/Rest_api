const express = require("express")
const router = express.Router()
const { getAllUsers, createNewUser, updateUser,deleteUser } = require("../controllers/usersControllers")
const db = require("../database")

//GET METHOD
router.get("/users",getAllUsers)

module.exports = router

router.post("/users",createNewUser)

// PUT : Mettre à jour un utilisateur basé sur les données envoyées dans le corps (body) de la requête et l'ID utilisateur passé dans l'URL
router.put("/:id", updateUser);
 
// DELETE : Supprimer un utilisateur basé sur l'ID passé dans l'URL
router.delete("/:id", deleteUser);
 
// GET : Récupérer un utilisateur basé sur l'ID passé dans l'URL
router.get("/:id", (req, res) => {
    // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
    const id = parseInt(req.params.id);
 
    // Trouver l'index de l'utilisateur correspondant à cet ID
    const userIndex = users.findIndex((user) => user.id === id);
 
    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 404
    if (userIndex < 0) {
        return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }
 
    // Si l'utilisateur est trouvé, renvoyer les informations de cet utilisateur
    res.json(users[userIndex]);
});