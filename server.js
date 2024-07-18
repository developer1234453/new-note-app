const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});
const PORT = process.env.PORT || 5000;



// MongoDB connection
const db = "mongodb://localhost:27017/NEW-NOTES-PACK"; 
mongoose.connect(db)
  .then(() =>{ 
    console.log('MongoDB connected')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
  .catch(err => {
    console.log(err);
  
})
