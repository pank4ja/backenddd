const express = require("express");
const app = express();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const path = require('path');
const cookieParser = require("cookie-parser")

app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.render("index");
});


app.post("/create", (req,res)=>{
  let {username, email, password, age} = req.body;

  bcrypt.genSalt(10,(err,salt)=>{
   // console.log(salt);
  //  if(err) return 
    bcrypt.hash(password,salt, async(err,hash)=>{
      let createduser = await userModel.create({
        username: username,
        email: email,
        password: hash,
        age: age
      });
    // console.log(hash);  

      let token = jwt.sign({email: email},"shhhhhhhhhh");
      res.cookie("token", token);
      res.send(createduser);
    });
  })
});


app.get("/login",function(req,res){
  res.render("login");
})


app.post("/login", async (req,res) =>{
  let user = await userModel.findOne({email: req.body.email});
  // console.log(user);
  if(!user){
    return res.send("something went wrong");
  }
  console.log(user.password, req.body.password);  // kya password pehle se save and and usne abhi kya password dala hai

  bcrypt.compare(req.body.password,user.password,function(err,result){
    // console.log(result);
    if(result){
      let token = jwt.sign({email: user.email},"shhhhhhhhhh");
      res.cookie("token", token);
      res.send("yes you can login")
    }
    else{
      res.send("something is wrong");
    }
  });
  
})


app.get("/logout",function(reqq,res){
  res.cookie("token","");
  res.redirect("/");
});

app.listen(3000)