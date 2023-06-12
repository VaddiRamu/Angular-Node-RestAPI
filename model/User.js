const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
}, {
    collection: 'signup'
})

module.exports = mongoose.model('userSchema', userSchema);
userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
