// connecting to database
const connectToDB = require('./DB');
//calling a function
connectToDB()

// calling dotenv
require('dotenv').config();

// connecting to express 
const express = require('express')
const app = express()
const port = process.env.PORT || 4001

// middleware to acceprt json file from the request
app.use(express.json());

// routes avaliabe
app.use('/api/auth', require('./routes/auth'))

app.listen(port)