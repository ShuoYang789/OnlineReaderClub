const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const _ = require('lodash');
const Reader = require('../../../models/readers');
const mongoose = require("mongoose");

let server;
let db;

const mongodbUri = 'mongodb+srv://syang:ys1998@online-reader-club-cluster-edjlk.mongodb.net/test?retryWrites=true&w=majority'

describe('readers', () => {
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
            let reader = new Reader();
            reader.username = 'Jonathan18';
            reader.password = 'J102938';
            await reader.save();
            reader.username = 'HuaHua';
            reader.password = 'hh28379';
            await reader.save();
        } catch (e) {
            console.log(e);
        }
    });

    describe('GET /readers/:name', () => {
        describe('when the name is valid', () => {
            it('should return the matching reader', function () {
                return request(server)
                    .get('/readers/HuaHua')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property("username", "HuaHua");
                        expect(res.body).to.have.property("password", "hh28379");
                    });
            });
        });
        describe('when the name is invalid', () => {
            it('should return the NOT Found message', function () {
                return request(server)
                    .get('/readers/badName')
                    .expect(200)
                    .expect({message: 'Reader NOT Found!'});
            });
        });
    });

    describe('POST /readers', () => {
        it('should return confirmation message and add a reader', function () {
            const reader = {
                username: 'Meng',
                password: 'm77889'
            };
            return request(server)
                .post('/readers')
                .send(reader)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("message", "Reader Added!");
                });
        });
        after(() => {
            return request(server)
                .get('/readers/Meng')
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("username", "Meng");
                    expect(res.body).to.have.property("password", "m77889");
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

