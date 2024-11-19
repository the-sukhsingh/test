require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Poem = require('./models/poem');


// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'your-default-mongodb-uri';
console.log(mongoUri);
mongoose.connect(mongoUri, {useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: false,
    ssl: true,});

const db = mongoose.connection;

db.on('error', (error) => console.error(error));

db.once('open', () => console.log('Connected to Database'));

const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());

// Use body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');


});



// Get all poems
app.get("/poems", (req, res) => {



    Poem.find().then((poems) => {
        res.status(200).json(poems);
    }).catch((error) => {
        res.status(400).json("Unable to fetch poems");
    });
});


// Get a poem by slug

app.get("/poem/:slug", (req, res) => {
    Poem.findOne({slug: req.params.slug}).then((poem) => {
        res.status(200).json(poem);
    }).catch((error) => {
        res.status(400).json("Unable to fetch poem");
    });
});


app.post("/addPoem", (req, res) => {
    const {title,body,password} = req.body;
    if(password !== process.env.PASSWORD) {
        res.status(401).json("Unauthorized");
        return;
    }
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const poem = new Poem({title, body, slug,date: new Date()});
    poem.save().then(() => {
        res.status(200).json("Poem added successfully");
    }).catch((error) =>
    {
        res.status(400).json("Unable to save to database");
    });

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});