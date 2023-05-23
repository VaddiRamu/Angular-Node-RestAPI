const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const imgSchema = mongoose.Schema({
    img:{data:Buffer,contentType: String}
},
{collection: 'uploads'});


module.exports = mongoose.model("imageSchema",imgSchema);

  