// npm install axios mongoose dotenv
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

const Artwork = require("./models/Artwork.model");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importArtworks() {
  try {
    const { data } = await axios.get(
      "https://api.artic.edu/api/v1/artworks?page=1&limit=100&fields=title,artist_display,date_display,image_id,place_of_origin,description,short_description,medium_display,color,on_loan_display,artwork_type_title"
    );

    const artworks = data.data.map((item) => ({
      title: item.title,
      artist: item.artist_display,
      date_display: item.date_display,
      imageUrl: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : item.thumbnail?.lqip,
      year: item.date_display,
      description: item.description,
    }));

    await Artwork.insertMany(artworks);
    console.log("✅ Artworks imported successfully!");
  } catch (error) {
    console.error("❌ Error importing artworks:", error);
  } finally {
    mongoose.disconnect();
  }
}

importArtworks();
