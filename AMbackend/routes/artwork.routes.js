const ArtworkModel = require("../models/ArtWork.model");

const router = require("express").Router();

//to create an artwork
router.post("/create", async (req, res) => {
  ArtworkModel.create(req.body)
    .then((responseFromDB) => {
      console.log("artwork created!", responseFromDB);
      res.status(201).json(responseFromDB);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "trouble creating an artwork" });
    });
});

//to get all the artwork
router.get("/all", async (req, res) => {
  ArtworkModel.find()
    .populate("owner")
    .then((responseFromDB) => {
      console.log("here are all the artwork!", responseFromDB);
      res.status(200).json(responseFromDB);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "trouble finding all the artwork" });
    });
});

//to get a daily random artwork
router.get("/daily", async (req, res) => {
  const allArtworks = await ArtworkModel.find()
    .then((allArtworks) => {
      if (allArtworks.length === 0) {
        return res.status(404).json({ message: "No artworks found" });
      }
      //to choose a random artwork
      const randomIndex = Math.floor(Math.random() * allArtworks.length);
      const randomArtwork = allArtworks[randomIndex];
      res.status(200).json(randomArtwork);
    })
    .catch((error) => {
      console.error("Error fetching daily artwork:", error);
      res.status(500).json({ errorMessage: "Error fetching daily artwork" });
    });
});

//to get one by id
router.get("/:artworkId", async (req, res) => {
  const { artworkId } = req.params;
  ArtworkModel.findById(artworkId)
    .then((responseFromDB) => {
      console.log("here is one artwork!", responseFromDB);
      res.status(200).json(responseFromDB);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "trouble finding one artwork" });
    });
});

//update an artwork
router.patch("/update/:artworkId", (req, res) => {
  const { artworkId } = req.params;
  ArtworkModel.findByIdAndUpdate(artworkId, req.body, { new: true }) // the artworkId and whatever is on the form from the update
    .populate("owner")
    .then((updatedArtwork) => {
      console.log("artwork updated", updatedArtwork);
      res.status(200).json(updatedArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "trouble updating an artwork" });
    });
});
//delete an artwork
router.delete("/delete/:artworkId", async (req, res) => {
  const { artworkId } = req.params;
  const deletedArtwork = await ArtworkModel.findByIdAndDelete(artworkId)
    .then((deletedArtwork) => {
      console.log("artwork deleted", deletedArtwork);
      res.status(204).json(deletedArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "trouble deleting an artwork" });
    });
});

module.exports = router;
