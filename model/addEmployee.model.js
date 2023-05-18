const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addEmpSchema = new Schema({
  name : {
    type:String
  },
  description : {
    type:String
  },
  designation : {
    type:String
  }
}, {collection: "employees"}
);
addEmpSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("addEmployeeSchema", addEmpSchema);
