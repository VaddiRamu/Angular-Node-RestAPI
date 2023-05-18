const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const employeesSchema = new Schema({
//   name : {
//     type:String
//   },
//   description : {
//     type:String
//   },
//   designation : {
//     type:String
//   }
// },
// {collection: 'employees'}
// );
// employeesSchema.method("toJSON", function() {
//   const { __v, _id, ...object } = this.toObject();
//   object.id = _id;
//   return object;
// });

// const registerEmpSchema = new Schema({
//   firstName : {
//     type:String
//   },
//   location : {
//     type:String
//   },
//   phone : {
//     type:Number
//   },
//   email : {
//     type:String,
//     require : true,
//     unique : true
//   },
//   date:{
//     type: Date,
//     default : Date.now,
//   }
// },
// {collection: 'registration'}
// );

// register details Add ////
// const AddressSchema = mongoose.Schema({
//   city:  {
//     type:String
//   },
//   street: {
//     type:String
//   },
//   houseNumber: {
//     type:String
//   },
// },
// {collection: 'registration'});
// const ContactInfoSchema = mongoose.Schema({
//   tel: [{type:Number, required:true}],
//   email: [{type:String, required:true}],
//   address: {
//     type: [AddressSchema],
//     required: true,
//   },
// },
// {collection: 'registration'});
// const registerEmpSchema = mongoose.Schema({
//   firstName: {
//     type:String
//   },
//   lastName: {
//     type:String
//   },
//   company: {
//     type:String
//   },
//   connectInfo: {
//     type : [ContactInfoSchema],
//     required : true,
//   },
// },
// {collection: 'registration'}
// );


/// userDetails Add ///
const userDetailsSchema = new Schema({
  firstname : {
    type:String
  },
  lastname : {
    type:String
  },
  city : {
    type:String
  },
  other_city : {
    type:String
  },
  email :{
  type: String,
  required: true,
  minlength: 5,
  maxlength: 255,
  unique: true
},
  selectReasonName : {
    type:String
  },
  zipcode : {
    type:Number,
    require: true,
    minlength: 6,
    maxlength: 8
  },
  checkbox : {
    type:Boolean
  }
},
{collection: 'userDetails'}
);
userDetailsSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
function validateUser(user) {
  const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      zipcode: Joi.string().min(6).max(8).required(),
  };
  return Joi.validate(user, schema);
}

exports.validate = validateUser;

//module.exports = mongoose.model("EmployeesSchema", employeesSchema);
//module.exports = mongoose.model("RegisterEmpSchema", registerEmpSchema);
//module.exports = mongoose.model("RegisterEmpSchema", registerEmpSchema, ContactInfoSchema, AddressSchema);
module.exports = mongoose.model("UserDetailsSchema", userDetailsSchema);

