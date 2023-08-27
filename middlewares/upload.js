const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../db/database");

const fileSizeFormat = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes)/ Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
 }

var storage = new GridFsStorage({
  url: dbConfig.db,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    //const length = fileSizeFormat(file.size, 2);
    
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-Ramatheertham-${file.originalname}`;
      //const length = fileSizeFormat(file.size, 2);
      //return [filename, length];
      return filename;
    
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-Ramatheertham-${file.originalname}`,
      length: fileSizeFormat(file.size, 2)
    };
  }
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;