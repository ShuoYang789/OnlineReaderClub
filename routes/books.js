let Book = require('../models/books');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Book.find(function (err, books) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(books, null, 2));
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Book.find({'_id': req.params.id}, function (err, book) {
        if (err)
            res.send(JSON.stringify({message: 'Book NOT Found!', errmsg: err}, null, 2));
        else
            res.send(JSON.stringify(book, null, 2));
    });
}

router.findByAuthor = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Book.find({'author': req.params.author}, function (err, books) {
        if (books.length == 0)
            res.json({message: 'Author NOT Found!'});
        else
            res.send(JSON.stringify(books, null, 2));
    });
}

router.fuzzySearch = (req, res) => {
    let keyword = req.params.keyword;
    Book.find(
        {
            $or: [
                {bookname: {$regex: keyword, $options: '$i'}},
                {author: {$regex: keyword, $options: '$i'}}
            ]
        },
        {limit: 100},
        function (err, arrayOfBookID) {
            if (arrayOfBookID.length == 0)
                res.json({message: 'No Relevant Results!'});
            else {
                arrayOfBookID.forEach((b) => {
                    Book.find({'_id': b._id}).then((book) => {
                        //console.log(book);
                    });
                });
                res.json({message: 'OK!'});
            }
        }
    );
}

router.addBook = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var book = new Book();

    book.bookname = req.body.bookname;
    book.author = req.body.author;
    book.ISBN = req.body.ISBN;
    book.pubHouse = req.body.pubHouse;
    book.pubDate = req.body.pubDate;
    book.numOfPages = req.body.numOfPages;

    book.save(function (err) {
        if (err)
            res.send(JSON.stringify({message: 'Book NOT Added!', errmsg: err}, null, 2));
        else
            res.send(JSON.stringify({message: 'Book Added!', data: book}, null, 2));
    });
}

router.deleteBook = (req, res) => {
    Book.findByIdAndRemove({'_id': req.params.id}, function (err) {
        if (err)
            res.json({message: 'Book NOT Deleted!', errmsg: err});
        else
            res.json({message: 'Book Successfully Deleted!'});
    });
}

module.exports = router;