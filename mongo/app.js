const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post")

app.get("/",(req,res)=>{
  res.send("hi");
})

app.get("/create",async (req,res)=>{
  let user = await userModel.create({
    username: "pankaj",
    age: 23,
    email: "pankaj@gmail.com"
  });

  res.send(user);
})


app.get("/post/create",async (req,res)=>{
  let post = await postModel.create({
    postdata: `hello sare log`,
    user: "68518e16d9743d75a27214b9"
  })

  let user = await userModel.findOne({
    _id: "68518e16d9743d75a27214b9"
  });
  user.posts.push(post._id);
  await user.save();
  res.send({post, user});
})


app.listen(3000);