const mongoose = require('mongoose')
const { Schema } = mongoose;

const verifyOtpSchema = new Schema({
    userId: {
        type: String
    }
    ,hashedOtp: {
        type: String,
        require
    },
    email: {
        type: String,
        require
    },
    CreatedAt: { type: Date, default: Date.now },
    expireat: { type: Date },

});

const VerifyOtp = mongoose.model('verifyOtp', verifyOtpSchema);

module.exports = VerifyOtp