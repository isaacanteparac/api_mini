// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 6060;

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/animeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir el esquema de datos
const animeSchema = new mongoose.Schema({
  fullName: String,
  image: Number,
  sensitiveImage: Boolean,
  characteristics: {
    animeName: String,
    gender: String,
    sex: String,
    status: String,
    birthday: Number,
    specie: String,
    planet: String
  }
});

const Anime = mongoose.model('Anime', animeSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas CRUD
app.get('/anime', async (req, res) => {
  try {
    const animeData = await Anime.find();
    res.json(animeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/anime', async (req, res) => {
  const anime = new Anime(req.body);
  try {
    const newAnime = await anime.save();
    res.status(201).json(newAnime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/anime/:id', getAnime, (req, res) => {
  res.json(res.anime);
});

app.patch('/anime/:id', getAnime, async (req, res) => {
  if (req.body.fullName != null) {
    res.anime.fullName = req.body.fullName;
  }
  if (req.body.image != null) {
    res.anime.image = req.body.image;
  }
  // Actualiza otros campos según sea necesario

  try {
    const updatedAnime = await res.anime.save();
    res.json(updatedAnime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/anime/:id', getAnime, async (req, res) => {
  try {
    await res.anime.remove();
    res.json({ message: 'Anime eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getAnime(req, res, next) {
  let anime;
  try {
    anime = await Anime.findById(req.params.id);
    if (anime == null) {
      return res.status(404).json({ message: 'Anime no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.anime = anime;
  next();
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
