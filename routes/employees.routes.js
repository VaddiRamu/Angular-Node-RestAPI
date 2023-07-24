const express = require('express');
const app = express();
const fs = require("fs");
const multer = require("multer");
const path = require('path');

const otpGenerator = require('otp-generator');
const bodyparser=require('body-parser');
const nodemailer=require('nodemailer');
const exphbs=require('express-handlebars');

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
const emailOtpSchema = require('../model/emailOtp.model');
const Razorpay = require('razorpay');

// view engine setup
// app.engine('handlebars',exphbs.engine({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ "}));
// app.set('view engine','handlebars');

// body parser middleware
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

employeesExpressRoute.post('/google/login', (req,res) =>{
  // const google_token = req.body.credential;
  // const g_csrf_token = req.body.g_csrf_token;
  console.log(req.body);  // print the post request body on console
  //res.json ({success: true, status: "Succefully generated Google login Token", google_token,g_csrf_token })
  res.redirect('http://localhost:4200/home');
})

// ======   Razorpay ====////
var instance = new Razorpay({
  key_id: 'rzp_test_RBstlzQTJJbm1n',
  key_secret: '9NH0ke02E8pQIdOhGSUwW5gB',
  });

  employeesExpressRoute.post('/razorPayOrder', (req, res, next) =>{
    // var instance = new Razorpay({
    //   key_id: 'rzp_test_LVDDqNS6WX3HrH',
    //   key_secret: 'RyQR7H6Cm8Qle1dJJGtfJe0i',
    //   })

  //  const key_id= 'rzp_test_LVDDqNS6WX3HrH';
  //  const key_secret= 'RyQR7H6Cm8Qle1dJJGtfJe0i';

  //var amount = utility.rupeesTopaise(req.body.payload.amount);
  var options = {
      //method: 'POST',
      //url: 'https://api.razorpay.com/v1/orders',
      //"authorization" : (new Buffer.from(key_id + ":" + key_secret, 'base64')).toString('utf8'),
      // headers: 
      //       {
      //         //"Authorization": 'Basic' + new Buffer.from(key_id + ":" + key_secret).toString("base64")
      //         "authorization" : "Basic xxxxMyEncodedString"
      //       },
      amount : req.body.amount*100,
      //amount: amount,
      currency: "INR",
      receipt: "Order0141",
      notes: {
        key1: "value3",
        key2: "value2",
      },
  };
  
  instance.orders.create(options, (err,order) =>{
  if(err) {
  console.log(err);
  next (err);
  }
  if (order) {
    res.status(200);
    res.json ({success: true, status: "Order created Successfully", orderId: order.id, value: order})
  }
});
});

//------------------
// Create a campaign\
//------------------
// Include the Brevo library\
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// var defaultClient = SibApiV3Sdk.ApiClient.instance;
// // Instantiate the client\
// var apiKey = defaultClient.authentications['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'];
// apiKey = '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';
// var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
// var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
// // Define the campaign settings\
// emailCampaigns.name = "Campaign sent via the API";
// emailCampaigns.subject = "My subject";
// emailCampaigns.sender = {"name": "angular email verification", "email":"vramu0401@gmail.com"};
// emailCampaigns.type = "classic";
// // Content that will be sent\
// //htmlContent: 'Congratulations! You successfully sent this example campaign via the Brevo API.',
// // Select the recipients\
// //recipients; {[2, 7]}
// // Schedule the sending in one hour\
// //scheduledAt: '2018-01-01 00:00:01'
// // Make the call to the client\
// apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
//     console.log('API called successfully. Returned data: ' + data);
//     }, function(error) {
//     console.error(error);
// });

//// email OTP verification  ////
var email;

// var otp = Math.random();
// otp = otp * 1000000;
// otp = parseInt(otp);
// const otp = otpGenerator.generate(4, {
//     digits: true, alphabets: false, upperCase: false, specialChars: false
// });
// console.log("Generate OTP ",otp);

let transporter = require('nodemailer').createTransport({
    // host: "smtp-relay.sendinblue.com",
    // port: 587,
    // secure: false,
    // service : 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'gmail',
    auth: {
      user: 'vramu0401@gmail.com',
      pass: 'ckyilrlzepsvhbaz'
    }
    // service: 'gmail', // or your own SMTP 
    // providerauth: {user: 'vramu0401@gmail.com'}, // user -> important
    // pass: '1135811358' // pass -> important (do not use password)
    
});
    
employeesExpressRoute.post('/emailOtp',function(req,res){
    email=req.body.email;
    if(email == null){
      res.json("Email is required");
    }
    const otp = otpGenerator.generate(4, {
        digits: true, alphabets: false, upperCase: false, specialChars: false
    });
    console.log("Generate OTP: ",otp);
     // send mail with defined transport object
    var mailOptions={
        //from: req.body.name + '&lt;' + req.body.email + '&gt;',
        from: 'angularsmtp@gmail.com',
        to: req.body.email,
        subject: "Angular application email verification. ",
        html: "<h3>Here is your OTP for account verification: </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        else {
          const emailInfo = new emailOtpSchema({
            email: req.body.email,
            otp: otp,
            email_id: info.messageId,
            //expiresIn: 60  + ' ' +'Secs',
          })
          emailInfo
            .save()
            .then((response) => {
              res.status(201).json({
                message: 'Email OTP successfully sent!',
                result: response,
              })
            })
          // info.status(200).json({
          // email: req.body.email,
          // otp: otp,
          // email_id: info.messageId,
          // expiresIn: 60  + ' ' +'Secs',
          // message: 'OTP sent successfully to your email.!',

        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp');
        }
    });
});

employeesExpressRoute.post('/emailOtpVerify', function (req,res){
  // let getOtp
  // emailOtpSchema
  //     .findOne({
  //       //email: req.body.email,
  //       otp: req.body.otp,
  //     })
  //     .then((otp) => {
  //       if (!otp) {
  //         return res.status(401).json({
  //           message: 'Authentication failed',
  //         })
  //       }
  //       getOtp = user
  //       console.log(user);
  //       return bcrypt.compare(req.body.otp, user.otp)
  //     })
  //     .then((response) => {
  //       if (!response) {
  //         return res.status(401).json({
  //           message: 'Authentication failed',
  //         })
  //       }
  //       // let jwtToken = jwt.sign(
  //       //   {
  //       //     email: getUser.email,
  //       //     userId: getUser._id,
  //       //   },
  //       //   'longer-secret-is-better',
  //       //   {
  //       //     expiresIn: '1 Sec',
  //       //   },
  //       // )
  //       res.status(200).json({
  //         message : 'OTP verification is successfull.!',
  //         result : response,
  //         // token: jwtToken,
  //         // expiresIn: 60  + ' ' +'Secs',
  //         // _id: getUser._id,
  //       })
  //     })
  //     .catch((err) => {
  //       return res.status(401).json({
  //         message: 'Authentication failed',
  //       })
  //     })  

  const otpHolder = emailOtpSchema.find({
    //email: req.body.email,
    otp: req.body.otp,
});
// console.log(otpHolder[0].otp);
// console.log(req.body.otp);

if (otpHolder[0].otp !== req.body.otp){
    console.log("hello");
}

if (otpHolder[0].otp !== req.body.otp) return res.status(400).send("Please Enter Correct OTP!");

const rightOtpFind = otpHolder[otpHolder.length - 1];
// const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

// if (rightOtpFind.number === req.body.number && validUser) {
    if (req.body.email) {
    const user = new User(_.pick(req.body, ["email"]));
    //const token = user.generateJWT();
    const result = user.save();
    const OTPDelete = otp.deleteMany({
        email: rightOtpFind.email
    });
    return res.status(200).send({
        message: "User Verification Successfull!",
        //token: token,
        data: result
    });
} else {
    return res.status(400).send("Your OTP was wrong!")
}
});


/////  Token based authentication   /////////
// Sign-up
employeesExpressRoute.post(
    '/register-user',
    [
      check('name')
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 10 })
        .withMessage('Name must be atleast 3 characters long'),
      check('email', 'Email is required').not().isEmpty(),
      check('password', 'Password should be between 5 to 8 characters long')
        .not()
        .isEmpty()
        .isLength({ min: 5, max: 8 }),     
        check('mobile', 'number should be 10 digits')
        .not()
        .isEmpty(), 
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
            mobile: req.body.mobile,
          })
          user
            .save()
            .then((response) => {
              res.status(201).json({
                message: 'User Successully Crated.',
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
