const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll()
  res.render("books/index", { books, title: "Books" });
}));

/* Create a new book. */
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book" });
});

/* POST created books. */
router.post('/', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books");
}));

/* Update book */
router.get("/:id/update", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id)
  res.render("books/update", { book, title: "Update Book" });
}));


/* POST updated book */
router.post('/:id/update', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  await book.update(req.body)
  res.redirect("/books");
}));

/* Asking for delete confirmation */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("books/delete", { book, title: "Delete Book" });
}));

/* Delete book from the database. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id)
  await book.destroy();
  res.redirect("/books");
}));


module.exports = router;

