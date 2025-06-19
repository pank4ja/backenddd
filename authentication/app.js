const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

app.get("/",function(req,res){
  //res.cookie("name","tera bhai hun me");  // saving the data in browser by server by using key value pair
  // res.send("done");

//   bcrypt.genSalt(10, function(err, salt) {
//     // console.log(salt);
//     bcrypt.hash("pankaj", salt, function(err, hash) {
//         console.log(hash);  //$2b$10$WWKsPJWqi9vmHzwj12s4DOOMXnx4UdAaffb1ZUbDgzHL7x6BxkDcG
//       });
// });

  //   bcrypt.compare("pankaj","$2b$10$WWKsPJWqi9vmHzwj12s4DOOMXnx4UdAaffb1ZUbDgzHL7x6BxkDcG", function(err, result) {
  // console.log(result)});

  let token =  jwt.sign({email: "pankaj@gmail.com"},"secret");
  // console.log(token);
  res.cookie("token",token);
  res.send("done");
});

app.get("/read2",(req,res)=>{
  console.log(req.cookies);
  console.log(req.cookies.token);

  let data = jwt.verify(req.cookies.token, "secret");
  console.log(data);
  
  
  res.send("done reading")
  
})

app.get("/read",function(req,res){
  // console.log(req.cookies);
  // res.cookie("yeh","value")
  res.send("read page");
});



app.listen(3000);