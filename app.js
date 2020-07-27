//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.SECRET);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// connent to the mongoose database

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// to create a new database

const  userSchema =new mongoose.Schema ({
  email: String,
  password: String
});


// secrets
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});


const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

// to allow it to only save the data after the user has register it we have to put inside the post register route

app.post("/register", function(req, res) {
  const newUser = new User({
    // the data from the input of email werein we have set the name username
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });

});

// after successuflly reistered, to log in again we have to give the post login in request

app.post("/login", function(req, res) {
  const username= req.body.username;
  const password= req.body.password;
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });

});




app.listen(3000, function() {
  console.log("Server is up and running on port 3000");
});
