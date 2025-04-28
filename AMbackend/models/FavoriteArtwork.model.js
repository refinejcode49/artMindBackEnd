const { Schema, model, SchemaType } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const favoriteArtworkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artwork: {
      type: Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
    comment: {
      type: "String",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const FavoriteArtworkModel = model("FavoriteArtwork", favoriteArtworkSchema);

module.exports = FavoriteArtworkModel;
