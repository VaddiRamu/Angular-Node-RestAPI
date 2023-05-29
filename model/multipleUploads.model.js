const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const multipleFilesUpload = mongoose.Schema({
    title: {
        type: String,
    },
    files: [Object]
},{collection: 'uploadMultipleFiles'})

module.exports = mongoose.model("multipleFilesSchema",multipleFilesUpload);

  