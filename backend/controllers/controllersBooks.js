const Book = require('../models/book.js');

exports.createBook = (req, res) => {
    const fullLink = req.body.fullLink;
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
       userId: req.auth.userId,
       imageUrl: `${fullLink}`
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = ('/:id', (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${fullLink}`
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
  });

exports.deleteBook = ('/:id', (req, res, next) => {
Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

exports.getOneBook = ('/:id', (req, res, next) => {
    Book.findOne({
    _id: req.params.id
    })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
  });

exports.getAllBooks = ('/' + '', (req, res, next) => {
    Book.find()
    .then((books) => {res.status(200).json(books);})
    .catch((error) => {res.status(400).json({error: error});});
});