/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const mongoDbUrl = process.env.MONGODB_URL || "mongodb://localhost";
const mongoDbName = process.env.MONGODB_NAME || "mongo";
const mongoDbCollectionName = process.env.MONGODB_COLLECTION_NAME || "star-wars-quotes";
var db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const client = new MongoClient(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err, client) => {
    if (err) return console.log(err);
    db = client.db(mongoDbName);
    app.listen(3000, () => {
        console.log('listening on 3000');
    });
});

app.get('/', (req, res) => {
    db.collection(mongoDbCollectionName).find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', { quotes: result });
    });
});

app.put('/quotes', (req, res) => {
    db.collection(mongoDbCollectionName)
        .findOneAndUpdate({ name: 'Yoda' }, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
                sort: { _id: -1 },
                upsert: true
            }, (err, result) => {
                if (err) return res.send(err);
                res.send(result);
            });
});

app.delete('/quotes', (req, res) => {
    db.collection(mongoDbCollectionName).findOneAndDelete({ name: req.body.name },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send({ message: 'A darth vader quote got deleted' });
        });
});


app.post('/quotes', (req, res) => {
    db.collection(mongoDbCollectionName).save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    });
});