const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const registerEmpSchema = new Schema({
//     firstName : {
//       type:String
//     },
//     location : {
//       type:String
//     },
//     phone : {
//       type:Number
//     },
//     email : {
//       type:String,
//       require : true,
//       unique : true
//     },
//     date:{
//       type: Date,
//       default : Date.now,
//     }
//   },
//   {collection: 'registration'}
//   );
  
  // register details Add ////
  const AddressSchema = mongoose.Schema({
    location:  {
      type:String
    }
  });
  const ContactInfoSchema = mongoose.Schema({
    phone: [Number],
    email: [String],
    // addressDetails: {
    //   type: [AddressSchema],
    //   required: true,
    // },
  });
  const registerEmpSchema = mongoose.Schema({
    firstname: {
      type:String
    },
    addressDetails: {
      type : AddressSchema,
      required : true,
    },
    contactDetails: {
        type : ContactInfoSchema,
        required : true,
      },
  },
  {collection: 'registration'}
  );


  module.exports = mongoose.model("RegisterEmpSchema", registerEmpSchema);