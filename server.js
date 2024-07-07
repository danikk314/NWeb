const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas', err);
});

const stringSchema = new mongoose.Schema({
  value: String
});

const StringModel = mongoose.model('String', stringSchema);

app.post('/save-string', async (req, res) => {
  const { value } = req.body;
  try {
    let strings = await StringModel.find().sort({ _id: 1 });
    if (strings.length >= 5) {
      await StringModel.findByIdAndDelete(strings[0]._id);
    }
    const newString = new StringModel({ value });
    await newString.save();
    res.status(201).send('String saved successfully');
  } catch (error) {
    res.status(500).send('Error saving string');
  }
});

app.get('/get-strings', async (req, res) => {
  try {
    const strings = await StringModel.find().sort({ _id: 1 });
    res.json(strings.map(s => s.value));
  } catch (error) {
    res.status(500).send('Error retrieving strings');
  }
});

app.use(express.static('NWeb-main'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
