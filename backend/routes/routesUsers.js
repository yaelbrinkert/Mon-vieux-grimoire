const express = require('express');
const router = express.Router();

const controllersUsers = require('../controllers/controllersUsers.js');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

router.post('/signup', controllersUsers.signup);
router.post('/login', controllersUsers.login);

module.exports = router;