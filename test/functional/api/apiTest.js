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

    after(async () => {
        try {
            await db.dropDatabase();
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
});

