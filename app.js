//jshint esversion:6

// ---------------------------REQUIRE----------------------------------
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")


// ---------------------------SETUP----------------------------------
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// ---------------------------MONGOOSE----------------------------------
mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("user",userSchema);


// ---------------------------GET----------------------------------
app.get("/",function(req,res){
  res.render("home")
});

app.get("/login",function(req,res){
  res.render("login")
});

app.get("/register",function(req,res){
  res.render("register")
});


// ---------------------------POST----------------------------------
app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      User.find({},function(err,results){
        console.log(results);
        res.render("secrets");
      });
    }
  });

});

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
      if (foundUser.password === req.body.password){
      res.render("secrets");
      }
      else{
        res.redirect("login")
      }
    });
});

// ---------------------------SERVER----------------------------------
app.listen(7272,function(){
  console.log("Its working on port 7272....");
});
