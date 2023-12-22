const Router = require("express");
const router = new Router;

const booksRoutes = require("./booksRoutes");

router.get("/api/books", booksRoutes.getBooks);
router.post("/api/books", booksRoutes.postBooks);
router.delete("/api/books/:id", booksRoutes.deleteBooks);


module.exports = router