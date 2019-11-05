let mongoose = require("mongoose")

let BookSchema = new mongoose.Schema({
  bookname: String,
  author: String,
  ISBN: String,
  pubHouse: String,
  pubDate: String,
  numOfPages: Number
}, {versionKey: false},
{collection: "books"})

module.exports = mongoose.model("Book", BookSchema)