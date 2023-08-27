const upload = require("../middlewares/upload");
const dbConfig = require("../db/database");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.db;

const baseUrl = "http://localhost:8080/endpoint/files/";

const mongoClient = new MongoClient(url);

const fileSizeFormat = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes)/ Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
 }
 
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    //const length = fileSizeFormat(req.file.size, 2);
    console.log(req.file);
    console.log(fileSizeFormat(req.file.size, 2));

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.send({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.db);
    const images = database.collection(dbConfig.imgBucket + ".files");
   // const images = database.collection("files");

    const cursor = images.find({});

    if ((await collection.estimatedDocumentCount()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { uploadFiles, getListFiles, download };