const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wikiSchema = new Schema({
  title: String,
  content: String,
});

module.exports = mongoose.model("Article", wikiSchema);
