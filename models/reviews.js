let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ReviewSchema = new mongoose.Schema({
        readerNo: {type: Schema.Types.ObjectId, ref: 'Reader'},
        bookNo: {type: Schema.Types.ObjectId, ref: 'Book'},
        content: String,
        score: {type: Number, min: 1, max: 5},
        date: Date,
        likes: {type: Number, default: 0}
    }, {versionKey: false},
    {collection: 'reviews'});

module.exports = mongoose.model('Review', ReviewSchema);