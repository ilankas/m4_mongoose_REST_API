/*
npm init -y
npm i mongoose mongodb errorhandler express morgan

mongod --dbpath C:\nodejs\learning\m4_mongoose_REST_API\data\

node server.js
*/

const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const mongoose = require('mongoose');

// connect to mongoose
mongoose.connect('mongodb://localhost/m4')
  .then(() => console.log('connected.'))
  .catch((err) => {
    if(err) {
        console.error('Error connecting ', err.message);
        process.exit(-1);
    }
});

// declare Account model
const Account = mongoose.model('Account', 
{
    name: String,
    balance: Number,
});

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(errorhandler());

// GET
app.get('/accounts', (req, res) => {
    Account.find({},(err, accounts) => {
        if(err) return res.status(500).send(err.message);
        res.send(accounts);
    });
});

// POST
app.post('/accounts', (req, res) => {
    // capture account
    const acc = new Account(req.body);
    acc.save((err, doc) => {
        if(err) return res.status(500).send(err.message);
        res.send(acc);
    });
});

// DELETE
app.delete('/accounts/:id', (req, res) => {
    // delete account
    Account.findByIdAndRemove(req.params.id, function (err, acc) {
        if(err) return res.status(500).send(err.message);
        res.send(acc);
    });
});

// PUT
app.put('/accounts/:id',(req, res) => {
    Account.update({ _id: req.params.id }, req.body, (err, acc) => {
        if(err) return res.status(500).send(err.message);
        res.send(acc);
    });
});

app.listen(3000);