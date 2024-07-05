const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'dein_mongodb_atlas_connection_string';

// MongoDB Verbindung
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas', err);
});

// Einfaches Schema und Modell
const stringSchema = new mongoose.Schema({
  value: String
});

const StringModel = mongoose.model('String', stringSchema);

// Endpunkt zum Speichern eines neuen Strings
app.post('/save-string', async (req, res) => {
  const { value } = req.body;
  try {
    // Alle Einträge abrufen und sortieren
    let strings = await StringModel.find().sort({ _id: 1 });

    // Prüfen, ob mehr als 4 Einträge vorhanden sind
    if (strings.length >= 5) {
      // Ältesten Eintrag löschen
      await StringModel.findByIdAndDelete(strings[0]._id);
    }

    // Neuen String hinzufügen
    const newString = new StringModel({ value });
    await newString.save();

    res.status(201).send('String saved successfully');
  } catch (error) {
    res.status(500).send('Error saving string');
  }
});

// Endpunkt zum Abrufen aller Strings
app.get('/get-strings', async (req, res) => {
  try {
    const strings = await StringModel.find().sort({ _id: 1 });
    res.json(strings.map(s => s.value));
  } catch (error) {
    res.status(500).send('Error retrieving strings');
  }
});

// Statische Dateien aus dem 'public'-Verzeichnis servieren
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
