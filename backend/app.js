const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routesBooks = require('./routes/routesBooks.js');
const routesUsers = require('./routes/routesUsers.js');


mongoose.connect('mongodb+srv://admin:root@mon-vieux-grimoire.wyv6mfd.mongodb.net/?retryWrites=true&w=majority&appName=mon-vieux-grimoire',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(express.json());
app.use('/api/books', routesBooks);
app.use('/api/auth', routesUsers);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;