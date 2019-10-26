var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const readers = require('./routes/readers');
const books = require('./routes/books');
const reviews = require('./routes/reviews');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/readers/:name', readers.findOne);
app.get('/books', books.findAll);
app.get('/books/:id', books.findOne);
app.get('/books/:author/author', books.findByAuthor);
app.get('/reviews/:id', reviews.findOne);

app.get('/search/:keyword', books.fuzzySearch);

app.post('/readers', readers.addReader);
app.post('/books', books.addBook);
app.post('/reviews', reviews.addReview);

app.put('/readers/psd', readers.updatePassword);
app.put('/reviews/:id/content', reviews.updateContent);
app.put('/reviews/:id/likes', reviews.incrementLikes);

app.delete('/readers/:id', readers.deleteReader);
app.delete('/books/:id', books.deleteBook);
app.delete('/reviews/:id', reviews.deleteReview);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
