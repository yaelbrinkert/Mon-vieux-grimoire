const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.js');
const multer = require('../middlewares/multer-config');
const bookController = require('../controllers/controllersBooks.js');


router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.createRating);
router.get('/bestrating', bookController.getBestRated);
router.get('/:id', bookController.getOneBook);
router.put('/:id', auth, multer, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);
router.get('/', bookController.getAllBooks);

module.exports = router;