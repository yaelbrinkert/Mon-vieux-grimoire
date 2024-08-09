const Book = require('../models/book.js');
const fs = require('fs');

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
       userId: req.auth.userId,
       imageUrl: req.fullLink
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: req.fullLink
    } : { ...req.body };
    
    delete bookObject._userId;
   Book.findOne({_id: req.params.id})
       .then((book) => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
  };

  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.getOneBook = ('/:id', (req, res) => {
    Book.findOne({
    _id: req.params.id
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
  });

exports.getAllBooks = ('/' + '', (req, res) => {
    Book.find()
    .then((books) => {res.status(200).json(books);})
    .catch((error) => {res.status(400).json({error: error});});
});


exports.createRating = ('/:id', async (req, res) => {
  const userId = req.auth.userId;
  const newRating = {
    grade: req.body.rating,
    userId: userId,
  };
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingRatingIndex = book.ratings.findIndex(rating => rating.userId === userId);
    if (existingRatingIndex !== -1) {
      book.ratings[existingRatingIndex].grade = newRating.grade;
    } else {
      book.ratings.push(newRating);
    }

    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    const newAverage = totalRatings / book.ratings.length;
    book.averageRating = newAverage;

    await book.save();
    res.status(200).json({ message: 'Rating added/updated successfully!', book });
  } catch (error) {
    res.status(400).json({ error });
  }
});

exports.getBestRated = (req, res) => {
    Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
}