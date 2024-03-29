/*eslint no-unused-vars: "off" */
/*eslint no-console: "off" */
/*eslint no-undef: "off" */
const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const Reader = require("../../../models/readers")
const Book = require("../../../models/books")
const Review = require("../../../models/reviews")
const mongoose = require("mongoose")

let server
let db
let testID, bookID, readerID

const mongodbUri = "mongodb+srv://syang:ys1998@online-reader-club-cluster-edjlk.mongodb.net/test?retryWrites=true&w=majority"

describe("reviews test", () => {
  before(async () => {
    try {
      mongoose.connect(mongodbUri)
      server = require("../../../bin/www")
      db = mongoose.connection
    } catch (e) {
      console.log(e)
    }
  })

  beforeEach(async () => {
    try {
      await Reader.deleteMany({})
      await Book.deleteMany({})
      await Review.deleteMany({})

      let reader = new Reader()
      reader.username = "Jonathan18"
      reader.password = "J102938"
      await reader.save()
      readerID = reader._id

      let book = new Book()
      book.bookname = "The Hunger Games"
      book.author = "Suzanne Collins"
      book.ISBN = "0439023483"
      book.pubHouse = "Scholastic Press"
      book.pubDate = "Sep 14 2008"
      book.numOfPages = 374
      await book.save()
      bookID = book._id

      let review = new Review()
      review.readerNo = readerID
      review.bookNo = bookID
      review.content = "I love this book!"
      review.score = 5
      await review.save()
      testID = review._id
    } catch (e) {
      console.log(e)
    }
  })

  describe("GET /reviews/:id", () => {
    describe("when the ID is valid", () => {
      it("should return the matching review", function () {
        return request(server)
          .get(`/reviews/${testID}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body[0]).to.have.property("content", "I love this book!")
            expect(res.body[0]).to.have.property("score", 5)
          })
      })
    })
    describe("when the ID is invalid", () => {
      it("should return the NOT Found message", function () {
        return request(server)
          .get("/reviews/badID")
          .expect(200)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Review NOT Found!")
          })
      })
    })
  })

  describe("POST /reviews", () => {
    let newID
    it("should return confirmation message and add a review", function () {
      const review = {
        readerNo: readerID,
        bookNo: bookID,
        content: "I read it again!",
        score: 5
      }
      return request(server)
        .post("/reviews")
        .send(review)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property("message", "Review Added!")
          newID = res.body.data._id
        })
    })
    after(() => {
      return request(server)
        .get(`/reviews/${newID}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body[0]).to.have.property("content", "I read it again!")
          expect(res.body[0]).to.have.property("score", 5)
        })
    })
  })

  describe("PUT /reviews/:id/content", () => {
    describe("when the ID is valid", () => {
      it("should find the matching review and update its content", function () {
        const review = {
          newContent: "I think it is a great book!"
        }
        return request(server)
          .put(`/reviews/${testID}/content`)
          .send(review)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Review Updated!")
            expect(res.body.data).to.have.property("content", "I think it is a great book!")
          })
      })
      after(() => {
        return request(server)
          .get(`/reviews/${testID}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body[0]).to.have.property("content", "I think it is a great book!")
          })
      })
    })
    describe("when the ID is invalid", () => {
      it("should return the NOT Found message", function () {
        const review = {
          newContent: "I think it is a great book!"
        }
        return request(server)
          .put("/reviews/badID/content")
          .send(review)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Review NOT Found!")
          })
      })
    })
  })

  describe("PUT /reviews/:id/likes", () => {
    describe("when the ID is valid", () => {
      it("should find the matching review and increment its likes by 1", function () {
        return request(server)
          .put(`/reviews/${testID}/likes`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Likes + 1!")
            expect(res.body.data).to.have.property("likes", 1)
          })
      })
      after(() => {
        return request(server)
          .get(`/reviews/${testID}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body[0]).to.have.property("likes", 1)
          })
      })
    })
    describe("when the ID is invalid", () => {
      it("should return the NOT Found message", function () {
        return request(server)
          .put("/reviews/badID/likes")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Review NOT Found!")
          })
      })
    })
  })

  describe("DELETE /reviews/:id", () => {
    describe("when the ID is valid", () => {
      it("should remove the matching review", function () {
        return request(server)
          .delete(`/reviews/${testID}`)
          .expect(200)
          .expect({message: "Review Successfully Deleted!"})
      })
      after(() => {
        return request(server)
          .get(`/reviews/${testID}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body.length).to.equal(0)
          })
      })
    })
    describe("when the ID is invalid", () => {
      it("should return the NOT Deleted message", function () {
        return request(server)
          .delete("/reviews/badID")
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property("message", "Review NOT Deleted!")
          })
      })
    })
  })

  after(async () => {
    try {
      await db.dropDatabase()
    } catch (e) {
      console.log(e)
    }
  })
})