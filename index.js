const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "remotemysql.com",
  user: "7mG4WIo1Oa",
  password: "OGhBW0HWc7",
  database: "7mG4WIo1Oa"
});
   


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render(__dirname +"/index");
});

app.get("/questions/:eventId",function(req,res){ 
    let query = 'select * from Questions where event_id = "' + req.params.eventId + '"';
    let questions = [];
    con.connect(function(err) {
        if (err) {
          return console.error('error: ' + err.message);
        }
        console.log('Connected to the MySQL server.');
        });
    con.query(query, function (err, results,fields) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log("query executed");
        for(let i=0;i<results.length;i++){
            let myObject ={
                id: results[i]['question_id'] ,
                question:results[i]['content'] ,
                a:results[i]['option_A'] ,
                b:results[i]['option_B'],
                c:results[i]['option_C'],
                d:results[i]['option_D']
            }
            questions.push(myObject);
        }
        return questions;
    });
    con.end();
   
})

app.get("/past-performance",function(req,res){
    res.render(__dirname +"/past-performance");
});

app.get("/all-packages",function(req,res){
    res.render(__dirname +"/all-packages");
});

app.get("/test",function(req,res){
    res.render(__dirname +"/test");
});

app.get("/login",function(req,res){
    res.render(__dirname +"/login");
});

app.get("/practice",function(req,res){
    res.render(__dirname +"/practice");
});
app.get("/basic",function(req,res){
    res.render(__dirname +"/basic");
});

app.get("/imge",function(req,res){
    res.render(__dirname +"/imge");
});
app.get("/layout-static",function(req,res){
    res.render(__dirname +"/layout-static");
});
app.get("/front-page",function(req,res){
    res.render(__dirname +"/front-page")
});

app.get("/pay",function(req,res){
    res.render(__dirname +"/pay")
});

app.post("/login",function(req,res){
    console.log(req.body);
    res.send("login successful");
});

app.get("/register",function(req,res){
    res.render(__dirname +"/register");
});

app.post("/register",function(req,res){
    console.log(req.body);
    res.send("Registration successful");
});

app.get("/forgetPassword",function(req,res){
    res.render(__dirname +"/forget-password");
});

app.post("/forgetPassword",function(req,res){
    console.log(req.body);
    res.send("Password changed");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});





