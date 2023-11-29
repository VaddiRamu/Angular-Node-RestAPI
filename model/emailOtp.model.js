const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let emailOtpSchema = mongoose.Schema({
    email: {
        type: String,
        //unique: false
    },
    // password: {
    //     type: String
    // },
    otp: {
        type: String,
        //required: true
    },
    expiresIn: { type: Date, default: Date.now, index: { expires: 30 } }

    // After 5 minutes it deleted automatically from the database
}, 
// { 
//     timestamps: true 
// },
 {
    collection: 'emailOtp'
})

module.exports = mongoose.model('emailOtpSchema', emailOtpSchema);
