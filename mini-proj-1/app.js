const express = require("express");
const app = express();
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const path = require("path");
const postModel = require("./models/post");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const upload = require("./utils/multerconfig");



app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("views",path.join(__dirname,"views"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
const bcrypt = require("bcrypt");
const user = require("./models/user");





app.get("/",(req,res)=>{
  res.render("index")
});

app.get("/profile/upload",(req,res)=>{
  res.render("profileupload")
});

app.post("/upload",isLoggedIn,upload.single("image"),async (req,res)=>{
  let user = await userModel.findOne({email : req.user.email});
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile")
});


app.post("/register",async (req,res)=>{
  let {email, password, username, name, age} = req.body;

  let user = await userModel.findOne({
    email: email
  })
  if(user) return res.status(500).send("user already register");

  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(password,salt,async (err,hash)=>{
      let user = await userModel.create({
        username: username,
        email: email,
        age: age,
        name: name,
        password: hash
      });

      let token = jwt.sign({email: email, userid: user._id}, "shhhh");

      res.cookie("token",token);
      res.send("registred");
    })
  })
});


app.get("/login",(req,res)=>{
  res.render("login")
});


app.get("/profile", isLoggedIn, async (req,res)=>{
  let user = await userModel.findOne({email: req.user.email}).populate("posts");
  
  res.render("profile",{user});
})

app.get("/like/:id", isLoggedIn, async (req,res)=>{
  let post = await postModel.findOne({_id: req.params.id}).populate("user");

  if(post.likes.indexOf(req.user.userid)=== -1){
    post.likes.push(req.user.userid);
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid),1);
  }

  await post.save();
  res.redirect("/profile");
})


app.get("/edit/:id", isLoggedIn, async (req,res)=>{
  let post = await postModel.findOne({_id: req.params.id}).populate("user");

  res.render("edit",{post})
})

app.post("/update/:id", isLoggedIn, async (req,res)=>{
  let post = await postModel.findOneAndUpdate({_id: req.params.id},{content: req.body.content});

  res.redirect("/profile");
})

app.post("/post", isLoggedIn, async (req,res)=>{
  let user = await userModel.findOne({email: req.user.email});
  let {content} = req.body;
  let post = await postModel.create({
    user: user._id,
    content: content
  });

  user.posts.push(post._id);
  user.save();
  res.redirect("/profile");
})


app.post("/login",async (req,res)=>{
  let {email, password} = req.body;

  let user = await userModel.findOne({
    email: email
  })
  if(!user) return res.status(500).send("something went wrong");

  bcrypt.compare(password, user.password,(err, result) =>{
    if(result){
      let token = jwt.sign({email: email, userid: user._id}, "shhhh");
      res.cookie("token",token);
      res.status(200).redirect("/profile");
    }
    else{
      res.redirect("/login")
    }
})
  
});


app.get("/logout",(req,res)=>{
  res.cookie("token","");
  res.redirect("/login");
});


function isLoggedIn(req,res,next){
  if(req.cookies.token === "") res.redirect("/login")
  else{
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    
    next();
  }
}

app.listen(3005);