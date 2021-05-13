const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname +"/index.html");
});

app.get("/login",function(req,res){
    res.sendFile(__dirname +"/login.html");
});

app.post("/login",function(req,res){
    console.log(req.body);
    res.send("login successful");
});

app.get("/register",function(req,res){
    res.sendFile(__dirname +"/register.html");
});

app.post("/register",function(req,res){
    console.log(req.body);
    res.send("Registration successful");
});

app.get("/forgetPassword",function(req,res){
    res.sendFile(__dirname +"/forget-password.html");
});

app.post("/forgetPassword",function(req,res){
    console.log(req.body);
    res.send("Password changed");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});





