// connecting to database
const connectToDB = require('./DB');
connectToDB()

// calling dotenv
require('dotenv').config();

// connecting to express 
const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const path = '/api/auth'

// middleware to acceprt json file from the request
app.use(express.json());

// routes avaliabe
app.use(path, require('./routes/auth'))



app.listen(port)