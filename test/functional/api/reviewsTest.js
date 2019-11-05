const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const _ = require('lodash');
const Reader = require('../../../models/readers');
const Book = require('../../../models/books');
const Review = require('../../../models/reviews');
const mongoose = require("mongoose");

let server;
let db;
let testID, bookID, readerID;

const mongodbUri = 'mongodb+srv://syang:ys1998@online-reader-club-cluster-edjlk.mongodb.net/test?retryWrites=true&w=majority'

describe('reviews test', () => {
    before(async () => {
        try {
            mongoose.connect(mongodbUri);
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (e) {
            console.log(e);
        }
    });

    beforeEach(async () => {
        try {
            await Reader.deleteMany({});
            await Book.deleteMany({});
            await Review.deleteMany({});

            let reader = new Reader();
            reader.username = 'Jonathan18';
            reader.password = 'J102938';
            await reader.save();
            readerID = reader._id;

            let book = new Book();
            book.bookname = 'The Hunger Games';
            book.author = 'Suzanne Collins';
            book.ISBN = '0439023483';
            book.pubHouse = 'Scholastic Press';
            book.pubDate = 'Sep 14 2008';
            book.numOfPages = 374;
            await book.save();
            bookID = book._id;

            let review = new Review();
            review.readerNo = readerID;
            review.bookNo = bookID;
            review.content = 'I love this book!';
            review.score = 5;
            await review.save();
            testID = review._id;
        } catch (e) {
            console.log(e);
        }
    });

    describe('GET /reviews/:id', () => {
        describe('when the ID is valid', () => {
            it('should return the matching review', function () {
                return request(server)
                    .get(`/reviews/${testID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("content", "I love this book!");
                        expect(res.body[0]).to.have.property("score", 5);
                    });
            });
        });
        describe('when the ID is invalid', () => {
            it('should return the NOT Found message', function () {
                return request(server)
                    .get('/reviews/badID')
                    .expect(200)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property("message", "Review NOT Found!");
                    });
            });
        });
    });

    describe('POST /reviews', () => {
        let newID;
        it('should return confirmation message and add a review', function () {
            const review = {
                readerNo: readerID,
                bookNo: bookID,
                content: 'I read it again!',
                score: 5
            };
            return request(server)
                .post('/reviews')
                .send(review)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("message", "Review Added!");
                    newID = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get(`/reviews/${newID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("content", "I read it again!");
                    expect(res.body[0]).to.have.property("score", 5);
                });
        });
    });

    after(async () => {
        try {
            await db.dropDatabase();
        } catch (e) {
            console.log(e);
        }
    });
});