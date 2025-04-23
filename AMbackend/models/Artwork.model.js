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
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  tags: [String],
  //here we link the artWork to the user that created it if he did
  owner: {
    type: Schema.Types.ObjectId, // the _id in the DB
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create the model
const ArtworkModel = model("artwork", artworkSchema);

module.exports = ArtworkModel;
