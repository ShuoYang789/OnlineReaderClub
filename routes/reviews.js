let Review = require('../models/reviews');
let express = require('express');
let router = express.Router();

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Review.find({'_id': req.params.id}, function (err, review) {
        if (err)
            res.send(JSON.stringify({message: 'Review NOT Found!', errmsg: err}, null, 2));
        else
            res.send(JSON.stringify(review, null, 2));
    });
}

router.addReview = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var review = new Review();

    review.readerNo = req.body.readerNo;
    review.bookNo = req.body.bookNo;
    review.content = req.body.content;
    review.score = req.body.score;
    review.date = new Date().getTime();

    review.save(function (err) {
        if (err)
            res.send(JSON.stringify({message: 'Review NOT Added!', errmsg: err}, null, 2));
        else
            res.send(JSON.stringify({message: 'Review Added!', data: review}, null, 2));
    });
}

router.updateContent = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Review.findById({'_id': req.params.id}, function (err, review) {
        if (err)
            res.send(JSON.stringify({message: 'Review NOT Found!', errmsg: err}, null, 2));
        else {
            review.content = req.body.newContent;
            review.date = new Date().getTime();
            review.save(function (err) {
                if (err)
                    res.send(JSON.stringify({message: 'Review NOT Updated!', errmsg: err}, null, 2));
                else
                    res.send(JSON.stringify({message: 'Review Updated!', data: review}, null, 2));
            });
        }
    });
}

router.incrementLikes = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Review.findById({'_id': req.params.id}, function (err, review) {
        if (err)
            res.send(JSON.stringify({message: 'Review NOT Found!', errmsg: err}, null, 2));
        else {
            review.likes += 1;
            review.save(function (err) {
                if (err)
                    res.send(JSON.stringify({message: 'Likes + 1!', errmsg: err}, null, 2));
                else
                    res.send(JSON.stringify({message: 'Likes NOT Changed!', data: review}, null, 2));
            });
        }
    });
}

router.deleteReview = (req, res) => {
    Review.findByIdAndRemove({'_id': req.params.id}, function (err) {
        if (err)
            res.json({message: 'Review NOT Deleted!', errmsg: err});
        else
            res.json({message: 'Review Successfully Deleted!'});
    });
}

module.exports = router;