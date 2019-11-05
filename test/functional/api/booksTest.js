const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const _ = require('lodash');
const Book = require('../../../models/books');
const mongoose = require("mongoose");

let server;
let db;
let testID;

const mongodbUri = 'mongodb+srv://syang:ys1998@online-reader-club-cluster-edjlk.mongodb.net/test?retryWrites=true&w=majority'

describe('books test', () => {
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
            await Book.deleteMany({});
            let book = new Book();
            book.bookname = 'The Hunger Games';
            book.author = 'Suzanne Collins';
            book.ISBN = '0439023483';
            book.pubHouse = 'Scholastic Press';
            book.pubDate = 'Sep 14 2008';
            book.numOfPages = 374;
            await book.save();
            book = new Book();
            book.bookname = 'Catching Fire';
            book.author = 'Suzanne Collins';
            book.ISBN = '0439023491';
            book.pubHouse = 'Scholastic Press';
            book.pubDate = 'Sep 01 2009';
            book.numOfPages = 391;
            await book.save();
            book = new Book();
            book.bookname = 'Mockingjay';
            book.author = 'Suzanne Collins';
            book.ISBN = '0439023513';
            book.pubHouse = 'Scholastic Press';
            book.pubDate = 'Aug 24 2010';
            book.numOfPages = 390;
            await book.save();
            book = await Book.findOne({ISBN: '0439023513'});
            testID = book._id;
        } catch (e) {
            console.log(e);
        }
    });

    describe('GET /books', () => {
        it('should GET all the books', function () {
            return request(server)
                .get('/books')
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, book => {
                        return {
                            bookname: book.bookname,
                            ISBN: book.ISBN
                        };
                    });
                    expect(result).to.deep.include({
                        bookname: 'The Hunger Games',
                        ISBN: '0439023483'
                    });
                    expect(result).to.deep.include({
                        bookname: 'Catching Fire',
                        ISBN: '0439023491'
                    });
                    expect(result).to.deep.include({
                        bookname: 'Mockingjay',
                        ISBN: '0439023513'
                    });
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