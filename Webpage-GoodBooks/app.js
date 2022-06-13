const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/booksDB", {
  useNewUrlParser: true
})

var Rec_Books_Genre = [];
const booksSchema = {
  title: String,
  author: String,
  genre: String,
  rating: Number,
  image: String
};

const Book = mongoose.model("Book", booksSchema);
var Book_Found = {};

app.get("/", function(req, res) {
  res.render("home",{message:"Hello!"});
});

app.post("/", function(req, res) {

  const book1 = req.body.Book_searched;
  if (book1 != null) {
    Book.findOne({
      title: book1
    }, function(err, found) {
      if (found) {
        Rec_Books_Genre.push(found.genre);
        Book.find({
          genre: Rec_Books_Genre
        }, function(err, find) {
          if (find.title != found.title) {
            Book_Found = find;
          }
        }).limit(5);
        res.render("book", {
          title: found.title,
          author: found.author,
          genre: found.genre,
          rating: found.rating,
          image: found.image,
          books: Book_Found
        });
      } else {
        res.render("home",{message:"Sorry! Searched book not found!"});
      }
    });
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
