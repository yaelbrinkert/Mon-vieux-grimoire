const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const opti = express();
const storage = multer.memoryStorage();
const upload = multer({storage});

opti.use(express.static("./images"));

opti.post('/', upload.single('image'), async (req, res, callback) => {
  const {buffer, originalname} = req.file;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;
  await sharp(buffer)
  .webp({ quality: 30 })
  .toFile('./images/' + ref);
  const fullLink = `https://localhost:3000/images/${ref}`;
  //res.status(201).json({ fullLink });
  callback(null, fullLink);
});

module.exports = opti;