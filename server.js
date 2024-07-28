const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');


const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());


// Define Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/employees', require('./routes/auth'));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
