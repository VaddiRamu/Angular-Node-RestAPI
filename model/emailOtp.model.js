const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let emailOtpSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    // password: {
    //     type: String
    // },
    otp: {
        type: String,
        //required: true
    },
    //createdAt: { type: Date, default: Date.now, index: { expires: 300 } }

    // After 5 minutes it deleted automatically from the database
}, 
// { 
//     timestamps: true 
// },
 {
    collection: 'emailOtp'
})

module.exports = mongoose.model('emailOtpSchema', emailOtpSchema);
