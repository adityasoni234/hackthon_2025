const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/adminPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas and Models
const loginSchema = new mongoose.Schema({
    username: String,
    templateSelected: String,
    timestamp: { type: Date, default: Date.now },
});

const Login = mongoose.model('Login', loginSchema);

// API Endpoint to Save Login Details
app.post('/api/login', async (req, res) => {
    const { username } = req.body;

    // Save login details in MongoDB
    const login = new Login({ username });
    await login.save();

    res.status(200).json({ message: 'Login successful' });
});

// API Endpoint to Save Template Selection
app.post('/api/template', async (req, res) => {
    const { username, templateSelected } = req.body;

    const login = await Login.findOneAndUpdate(
        { username },
        { templateSelected },
        { new: true }
    );

    if (!login) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Template selection saved', login });
});

// API Endpoint to Fetch Admin Data
app.get('/api/admin', async (req, res) => {
    const logins = await Login.find().sort({ timestamp: -1 });
    res.status(200).json(logins);
});

// Start the Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
