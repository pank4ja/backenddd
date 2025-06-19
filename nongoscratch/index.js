const express = require("express");
const app = express();
const userModel = require("./models/user")

app.post("/",async (req,res)=>{
  const createduser = await userModel.create({
    username: "infinity",
    age: 18,
    name: "everything"
  });
  res.send(createduser);
});

app.get("/allusers",async (req,res)=>{
  let allusers = await userModel.find();
  res.send(allusers);
});


app.get("/findone",async (req,res)=>{
  let oneuser = await userModel.findOne({
    username: "ishu"
  });
  res.send(oneuser);
})

app.get("/deleteone",async (req,res)=>{
  let delone = await userModel.findOneAndDelete({
    username: "pankaj"
  });
  res.send(delone);
})

app.listen(3001);