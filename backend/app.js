require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routesBooks = require('./routes/routesBooks.js');
const routesUsers = require('./routes/routesUsers.js');

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(express.json());
app.use('/api/books', routesBooks);
app.use('/api/auth', routesUsers);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;