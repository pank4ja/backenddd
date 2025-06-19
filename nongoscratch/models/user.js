const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/newdb");  // create a db

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  age: Number
});   

// mongoose.model(naam, schema) ; //it creates collection

module.exports = mongoose.model("user",userSchema)