const FavoriteArtworkModel = require("../models/FavoriteArtwork.model");

const router = require("express").Router();
//const { isAuthenticated } = require("../middlewares/jwt.middleware");

// to add a favorite artwork from one user
router.post("/favorite", (req, res) => {
  const { artworkId } = req.body;
  const userId = req._id;

  FavoriteArtworkModel.create({ user: userId, artwork: artworkId })
    .then((favorite) => {
      console.log("here is one favorite artwork", favorite);
      res.status(201).json(favorite);
    })
    .catch((error) => {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Error adding favorite" });
    });
});

// to get all the favorites artwork from one user
router.get("/favorite", (req, res) => {
  const userId = req._id;

  FavoriteArtworkModel.find({ user: userId })
    .then((favorites) => {
      res.status(200).json(favorites);
    })
    .catch((error) => {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Error fetching favorites" });
    });
});

// to delete one favorite artwork
router.delete("/:artworkId", (req, res) => {
  const userId = req._id;
  const { artworkId } = req.params;

  FavoriteArtworkModel.findOneAndDelete({ user: userId, artwork: artworkId })
    .then((deletedFavorite) => {
      if (!deletedFavorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(204).json({ message: "Favorite removed" });
    })
    .catch((error) => {
      console.error("Error deleting favorite:", error);
      res.status(500).json({ message: "Error deleting favorite" });
    });
});

module.exports = router;
