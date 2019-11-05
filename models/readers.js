let mongoose = require("mongoose")

let ReaderSchema = new mongoose.Schema({
  username: String,
  password: String
}, {versionKey: false},
{collection: "readers"})

module.exports = mongoose.model("Reader", ReaderSchema)