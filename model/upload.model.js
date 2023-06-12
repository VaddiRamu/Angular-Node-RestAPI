const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const imgSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true,
      },
      fileSize: {
        type: String,
        required: true,
      },
      image: {
        data: Buffer,
        contentType: String,
      },
      filetype:{
        type: String,
      },
      filepath:{
        type: String,
      },
      uploadTime: {
        type: Date,
        default: Date.now,
      }
},
{collection: 'uploads'});

module.exports = mongoose.model("imageSchema",imgSchema);

  