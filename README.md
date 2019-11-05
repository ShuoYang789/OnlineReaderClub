# Assignment 1 - Agile Software Practice.

Name: Shuo Yang

## Overview.

My project is online reader club, which implements the basic operations of three types of data: readers, books, and reviews.

## API endpoints.

 + GET /readers/:name - Get a reader by username.
 + GET /books - Get all books.
 + GET /books/:id - Get a book by id.
 + GET /books/:author/author - Get all books of a particular author.
 + GET /reviews/:id - Get a review by id.
 + GET /search/:keyword - Get all books whose bookname or author contain keyword.
 + POST /readers - Add a new reader.
 + POST /books - Add a new book.
 + POST /reviews - Add a new review.
 + PUT /readers/psd - Update specific reader's password.
 + PUT /reviews/:id/content - Update specific review's content.
 + PUT /reviews/:id/likes - Increment specific review's likes by 1.
 + DELETE /readers/:id - Delete a specific reader.
 + DELETE /books/:id - Delete a specific book.
 + DELETE /reviews/:id - Delete a specific review.

## Data model.

Reader: {
  username: String,
  password: String
}

Book: {
  bookname: String,
  author: String,
  ISBN: String,
  pubHouse: String,
  pubDate: String,
  numOfPages: Number
}

Review: {
  readerNo: {type: Schema.Types.ObjectId, ref: "Reader"},
  bookNo: {type: Schema.Types.ObjectId, ref: "Book"},
  content: String,
  score: {type: Number, min: 1, max: 5},
  date: Date,
  likes: {type: Number, default: 0}
}

## Sample Test execution.

~~~
readers test
  GET /readers/:name
    when the name is valid
      ✓ should return the matching reader (41ms)
    when the name is invalid
      ✓ should return the NOT Found message (38ms)
  POST /readers
    ✓ should return confirmation message and add a reader (45ms)
  PUT /readers/psd
    when the ID is valid
      ✓ should find the matching reader and update its password (53ms)
    when the ID is invalid
      ✓ should return the NOT Found message
  DELETE /readers/:id
    when the ID is valid
      ✓ should remove the matching reader
    when the ID is invalid
      ✓ should return the NOT Deleted message

books test
  GET /books
    ✓ should GET all the books
  GET /books/:id
    when the ID is valid
      ✓ should return the matching book
    when the ID is invalid
      ✓ should return the NOT Found message
  GET /books/:author/author
    when the author exists
      ✓ should return all books of the author
    when the author does not exist
      ✓ should return the NOT Found message
  GET /search/:keyword
    when the keyword can be found
      ✓ should return the OK message
    when the keyword cannot be found
      ✓ should return the No Relevant Results message
  POST /books
    ✓ should return confirmation message and add a book
  DELETE /books/:id
    when the ID is valid
      ✓ should remove the matching book
    when the ID is invalid
      ✓ should return the NOT Deleted message

reviews test
  GET /reviews/:id
    when the ID is valid
      ✓ should return the matching review
    when the ID is invalid
      ✓ should return the NOT Found message
  POST /reviews
    ✓ should return confirmation message and add a review
  PUT /reviews/:id/content
    when the ID is valid
      ✓ should find the matching review and update its content (54ms)
    when the ID is invalid
      ✓ should return the NOT Found message
  PUT /reviews/:id/likes
    when the ID is valid
      ✓ should find the matching review and increment its likes by 1 (47ms)
    when the ID is invalid
      ✓ should return the NOT Found message
  DELETE /reviews/:id
    when the ID is valid
      ✓ should remove the matching review
    when the ID is invalid
      ✓ should return the NOT Deleted message


26 passing (5s)
~~~

## Extra features.
