const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({
  path:"./config.env",
}); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin:[process.env.FRONTENDURL],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,
}));
app.use(express.json());

// Ensure your environment variable is correctly loaded
const mongoUri =process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MongoDB URI is not set. Check your .env file.');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(mongoUri, {
  dbName:"testdb",
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Item model
const ItemSchema = new mongoose.Schema({
  name: String,
  course:String,
});

const Item = mongoose.model('items', ItemSchema);

// Search route
app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const items = await Item.find({ name: { $regex: query, $options: 'i' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(process.env.FRONTENDURL);
});
