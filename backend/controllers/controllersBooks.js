const Book = require("../models/book.js");
const fs = require("fs");

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.fullLink,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: req.fullLink,
      }
    : { ...req.body };
  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: "Not authorized" });
    } else {
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, imageUrl: req.fullLink }
      )
        .then(() => res.status(200).json({ message: "Objet modifié!" }))
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.createRating = async (req, res) => {
  const newRating = {
    grade: req.body.rating,
    userId: req.body.userId,
  };

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    book.ratings.push(newRating);
    const totalRatings = book.ratings.length;
    const sumOfRatings = book.ratings.reduce(
      (acc, rating) => acc + rating.grade,
      0
    );
    const newAverageRating = sumOfRatings / totalRatings;
    const bookUpdated = await Book.findByIdAndUpdate(
      req.params.id,
      {
        ratings: book.ratings,
        averageRating: newAverageRating,
      },
      {
        new: true,
      }
    );
    res.status(201).json(bookUpdated);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBestRated = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => {
      res.status(400).json({ error });
    });
};
