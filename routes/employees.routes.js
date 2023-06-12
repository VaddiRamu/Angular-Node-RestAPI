const express = require('express');
const app = express();
const fs = require("fs");
const multer = require("multer");
const path = require('path');

const employeesExpressRoute = express.Router();
const addEmployeeSchema = require('../model/addEmployee.model');
//const EmployeesSchema = require('../model/employees.model');
const RegisterEmpSchema = require('../model/registerEmployee');
const UserDetailsSchema = require('../model/employees.model');
const validate = require('../model/employees.model');
const imageSchema = require('../model/upload.model');
const multipleFilesSchema = require('../model/multipleUploads.model');
//const { EmployeesSchema, RegisterEmpSchema, UserDetailsSchema, User, validate } = require('../model/employees.model');
app.use(express.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../model/User');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');


/////  Token based authentication   /////////
// Sign-up
employeesExpressRoute.post(
    '/register-user',
    [
      check('name')
        .not()
        .isEmpty()
        .isLength({ min: 3 })
        .withMessage('Name must be atleast 3 characters long'),
      check('email', 'Email is required').not().isEmpty(),
      check('password', 'Password should be between 5 to 8 characters long')
        .not()
        .isEmpty()
        .isLength({ min: 5, max: 8 }),      
    ],
    //let RegularExpression = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/,
    (req, res, next) => {
      const errors = validationResult(req)
      console.log(req.body);
  
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array())
      } else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          const user = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash,
          })
          user
            .save()
            .then((response) => {
              res.status(201).json({
                message: 'User successfully created!',
                result: response,
              })
            })
            .catch((error) => {
              res.status(500).json({
                error: error,
              })
            })
        })
      }
    },
  )
  
  // Sign-in
  employeesExpressRoute.post('/signin', (req, res, next) => {
    let getUser
    userSchema
      .findOne({
        email: req.body.email,
      })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: 'Authentication failed',
          })
        }
        getUser = user
        return bcrypt.compare(req.body.password, user.password)
      })
      .then((response) => {
        if (!response) {
          return res.status(401).json({
            message: 'Authentication failed',
          })
        }
        let jwtToken = jwt.sign(
          {
            email: getUser.email,
            userId: getUser._id,
          },
          'longer-secret-is-better',
          {
            expiresIn: '1 Sec',
          },
        )
        res.status(200).json({
          token: jwtToken,
          expiresIn: 60  + ' ' +'Secs',
          _id: getUser._id,
        })
      })
      .catch((err) => {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      })
  })
  
  // Get Users
  employeesExpressRoute.route('/').get((req, res, next) => {
    userSchema.find((error, response)=> {
      if (error) {
        return next(error)
      } else {
        return res.status(200).json(response)
      }
    })
  })
  
  
  // Get Single User
  employeesExpressRoute.route('/user-profile/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(200).json({
          msg: data,
        })
      }
    })
  })
  
  // Update User
  employeesExpressRoute.route('/update-user/:id').put((req, res, next) => {
    userSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      (error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
          console.log('User successfully updated!')
        }
      },
    )
  })
  
  // Delete User
  employeesExpressRoute.route('/delete-user/:id').delete((req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(200).json({
          msg: data,
        })
      }
    })
  })

employeesExpressRoute.route('/employees').get((req,res, next) =>{
    //res.json({ message: "Welcome to Rest API with MongoDB." });
    // console.log(res); 
    app.use(express.json());
    addEmployeeSchema.find((error,data)=>{      
        console.log(res);  
        if(data){
            res.json(data) ;  
            console.log(data);         
        } else {
            return next(error);
        }
    })
})

/// OR ///
// employeesExpressRoute.get('/employees', function (req, res, next) {
//     app.use(express.json());
//     addEmployeeSchema.find((error,data)=>{      
//         console.log(res);  
//         if(data){
//             res.json(data) ;  
//             console.log(data);         
//         } else {
//             return next(error);
//         }
//     })
//   })


// Create employee
employeesExpressRoute.route('/add-employee').post((req, res, next) => {
    //res.send('Post employees API');
    addEmployeeSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Get single employee
employeesExpressRoute.route('/employees/:id').get((req,res) =>{
    addEmployeeSchema.findById(req.params.id,(error,data)=>{       
        if(error){
            return next(error)            
        } else {           
            res.json(data) 
        }
    })
})


// Update employee
employeesExpressRoute.route('/update-employee/:id').put((req, res, next) => {
    addEmployeeSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
            console.log('Employee successfully updated!')
        }
    })
})
// Delete employee
employeesExpressRoute.route('/delete-employee/:id').delete((req, res, next) => {
    addEmployeeSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log('Employee successfully Deleted!');
            res.status(200).json({
                msg: data               
            })
        }
    })
})

// register details with nested objects ///
employeesExpressRoute.route('/registerUser').post((req, res, next) => {
    //res.send('Post employees API');
    RegisterEmpSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

 // users details form without validations///
//   employeesExpressRoute.route('/userDetails').post( async(req, res, next) => { 
//     RegisterEmpSchema.create(req.body, (error, data) => {
//                         if (error) {
//                             return next(error)
//                         } else {
//                             res.json(data)
//                         }
//                     })
//   })

 // users details form with validations///
  employeesExpressRoute.route('/userDetails').post( async(req, res, next) => {   
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
  // Check if this user already exisits
  let user = await UserDetailsSchema.findOne({ email: req.body.email });
  if (user) {
      return res.status(400).send('That user already exisits!');
  } else {
      // Insert the new user if they do not exist yet
      UserDetailsSchema.create(req.body, (error, data) => {
                if (error) {
                    return next(error)
                } else {
                    res.json(data)
                }
            })
    }
})

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
     //cb(null, new Date().toISOString().replace(/:/g, '-') + '-'+ file.originalname);
      cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
    }
  })
  const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } 
      else {
        cb(new Error('Only .jpeg or .png files are accepted'), false);   
    }
};
  var upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
 });

 const singleFileUpload = async (req,res,next) => {
    try{
        const file = req.file;
        console.log(file);
        res.status(201).send('File uploaded success');
    } catch(error) {
        res.status(400).send(error.message)
    }
 }

 const fileSizeFormat = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes)/ Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
 }

 employeesExpressRoute.route("/uploadFile").post(upload.single('myImage'), (req,res, next)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    //console.log(encode_img);
    var file = {
        filetype:req.file.mimetype,
        image:new Buffer.from(encode_img,'base64'),
        filename: req.file.originalname,
        fileSize: fileSizeFormat(req.file.size, 2), // 0.00 after point 2 values
        filepath: req.file.path
    };
     //if (!req.myImage) return res.send("you must select a file.");
    //console.log(final_img);
    //console.log(req);
    imageSchema.create(file, function(err,data){
        // if (req.file == undefined) {
        //     return res.send({
        //       message: "You must select a file.",
        //     });
        //   }
        if(err){
            console.log(err, "Upload Issue");
        }else{
            res.status(201).send('File uploaded success');
            console.log("Saved To database");
            console.log(file);
            //res.send(Object.entries(final_img));
        }
    })
})

employeesExpressRoute.route("/uploadMultipleFiles").post(upload.array('myImages'), (req,res, next)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');

    const filesArray = [];
    req.myImages.array.forEach(element => {
        const file ={
            filetype: element.mimetype,
            //image:new Buffer.from(encode_img,'base64'),
            filename: element.originalname,
            fileSize: fileSizeFormat(element.size, 2), // 0.00 after point 2 values
            filepath: element.path
        }
        filesArray.push(file);
    });
    const multipleFiles = new multipleFilesSchema({
        title: req.body.title,
        files: filesArray
    });
 
    multipleFilesSchema.create(multipleFiles, function(err,data){
        if(err){
            console.log(err, "Upload Issue");
        }else{
            res.status(201).send('Multiple Files uploaded successfully');
            console.log("All files Saved To database");
            console.log(multipleFiles);
            //res.send(Object.entries(final_img));
        }
    })
})

employeesExpressRoute.route("/showUploads").get((req,res)=>{
    imageSchema.find().toArray(function (err,result){
       const imgArray = result.map(element =>element._id);
       console.log(imgArray);
       if(err){
           return console.error(err);
       }
       res.send(imgArray)
   })
});

module.exports = employeesExpressRoute;
