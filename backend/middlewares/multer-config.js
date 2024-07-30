const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const opti = express();
const storage = multer.memoryStorage();
const upload = multer({storage});

opti.use(express.static("./images"));

opti.post('/', upload.single('image'), async (req, res, callback) => {
  const {buffer, originalname} = req.file;
  
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const length = 16;
    let randomstring = "";
    for (i = 0; i < length; i++) {
      randomstring += characters.charAt(Math.floor(Math.random() * characters.length));
    }

  const modifiedname = originalname.replaceAll(' ', '');
  const ref = `${randomstring}${modifiedname}.webp`;
  await sharp(buffer)
  .webp({ quality: 30 })
  .toFile('./images/' + ref);
  const fullLink = `http://localhost:3000/images/${ref}`;
  req.fullLink = fullLink;
  callback(null, fullLink);
});

opti.put('/:id', upload.single('image'), async (req, res, callback) => {
  const {buffer, originalname} = req.file;
  
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const length = 16;
    let randomstring = "";
    for (i = 0; i < length; i++) {
      randomstring += characters.charAt(Math.floor(Math.random() * characters.length));
    }

  const modifiedname = originalname.replaceAll(' ', '');
  const ref = `${randomstring}${modifiedname}.webp`;
  await sharp(buffer)
  .webp({ quality: 30 })
  .toFile('./images/' + ref);
  const fullLink = `http://localhost:3000/images/${ref}`;
  req.fullLink = fullLink;
  callback(null, fullLink);
});

module.exports = opti;