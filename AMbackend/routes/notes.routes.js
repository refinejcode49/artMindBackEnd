const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// GET /api/users/notes/:artworkId
router.get("/notes/:artworkId", isAuthenticated, async (req, res) => {
    const userId = req.payload._id; // Extract user ID from the token
    const { artworkId } = req.params; // Extract artworkId from the route parameters
  
    try {
      // Find the user and filter notes by artworkId
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }
  
      // Filter notes for the given artworkId
      const notesForArtwork = user.notes.filter(
        (note) => note.artworkId.toString() === artworkId
      );
  
      res.status(200).json(notesForArtwork);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errorMessage: "Could not retrieve notes" });
    }
  });


router.post("/notes/:artworkId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { artworkId, content } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { notes: { artworkId, content } },
      },
      { new: true }
    );
    res.json({ message: "Note ajoutée", notes: updatedUser.notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Erreur ajout note" });
  }
});

// PATCH /api/users/notes/:artworkId
router.patch("/notes/:artworkId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { artworkId } = req.params;
  const { content } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          notes: {
            artworkId,
            content,
          },
        },
      },
      { new: true }
    ).populate("notes.artworkId");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Could not save note" });
  }
});

// PATCH /api/users/notes/update/:noteId
router.patch("/notes/update/:noteId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { noteId } = req.params;
  const { content } = req.body;

  try {
    const user = await UserModel.findById(userId);
    const note = user.notes.id(noteId);
    if (!note) return res.status(404).json({ errorMessage: "Note not found" });

    note.content = content;
    await user.save();
    res.json({ message: "Note updated", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Could not update note" });
  }
});

// DELETE /api/users/notes/delete/:noteId
router.delete("/notes/delete/:noteId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { noteId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    const note = user.notes.id(noteId);
    if (!note) return res.status(404).json({ errorMessage: "Note not found" });

    note.remove();
    await user.save();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Could not delete note" });
  }
});

module.exports = router;
