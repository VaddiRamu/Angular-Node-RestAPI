let express = require('express');
path = require('path');
mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = require("mongodb").ObjectID;
mongoose.set('strictQuery', true); // due to showing warning in Terminal
cors = require('cors');
bodyParser = require('body-parser');
const createError = require('http-errors');
dbConfig = require('./db/database');
fs = require("fs");
multer = require("multer");

//const Joi = require('joi');

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    usenewUrlParser : true,
    useUnifiedTopology: true
}).then (()=>{
    console.log("Database connected..!");
}, error => { console.log('Database could not connected.!' + error) })

// Setting up express
const app= express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(cors());

// // http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));
// app.use('/style', express.static('public'));

// // http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// Api root
const userRoute = require('./routes/employees.routes');
app.use('/endpoint', userRoute);
//app.use('/', userRoute);  // testing for upload functionality

// Create port
const port = process.env.PORT || 8080;
// Conectting port
const server = app.listen(port, ()=>{
    console.log("Connected Server " + port);
})
// Find 404 and hand over to error handler
app.use((req,res,next)=>{
  next(createError(404));
});

//error handler
app.use(function(err,req,res,next){
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})


//dbConfig.db.aggregate([{"$match":{'property': {$exists:true}}},{"$project":{"_id":1}}])

// Static build locatio
// app.use(express.static(path.join(__dirname, 'dist')));