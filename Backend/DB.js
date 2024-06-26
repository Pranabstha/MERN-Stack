const mongoose = require('mongoose');

// calling dotenv
require('dotenv').config();


const mongoURI = process.env.DATABASEURL
// console.log(mongoURI)
const connectToDB = () => {
    mongoose.connect(mongoURI)
    console.log('Database Connected Successfully!!!!')
}
module.exports = connectToDB;