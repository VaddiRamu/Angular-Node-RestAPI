const express = require('express');
const app = express();

const employeesExpressRoute = express.Router();
const addEmployeeSchema = require('../model/addEmployee.model');
//const EmployeesSchema = require('../model/employees.model');
const RegisterEmpSchema = require('../model/registerEmployee');
const UserDetailsSchema = require('../model/employees.model');
const validate = require('../model/employees.model');
//const { EmployeesSchema, RegisterEmpSchema, UserDetailsSchema, User, validate } = require('../model/employees.model');
app.use(express.json());
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
            console.log('Employee successfully Deleted!')
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

module.exports = employeesExpressRoute;
