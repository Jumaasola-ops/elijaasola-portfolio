const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware with specific CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5000', 'null'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection with better error handling
mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        console.log('Database: portfolio');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('Please ensure MongoDB is running');
    });

// Contact form model
const Contact = require('./models/Contact');

// Routes with detailed error handling
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);
        
        // Validate input
        if (!req.body.name || !req.body.email || !req.body.message) {
            console.error('Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        const contact = new Contact(req.body);
        await contact.save();
        console.log('Message saved successfully:', contact);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Server error while sending message' });
    }
});

// Serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Please ensure MongoDB is running before testing the contact form');
});