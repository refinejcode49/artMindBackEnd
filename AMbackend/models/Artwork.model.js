const { Schema, model } = require("mongoose");

const artworkSchema = new Schema({
  title: {
    type: String,
    required: [true, "artwork title is required"],
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create the model
const ArtworkModel = model("artwork", artworkSchema);

module.exports = ArtworkModel;
