const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const mysql = require('mysql');
const authController = require("./controller/auth");
const cookieParser = require("cookie-parser");
const { db } = require("./constants");

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/index', { data : {
            user : req.user
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/user", authController.isLoggedIn, function(req, res){
    if( req.user ){
        res.json(req.user);
    }
    else {
        res.send({});
    }
})

app.get("/questions/:eventId",function(req,res){ 
    let query = 'select * from Questions where event_id = "' + req.params.eventId + '"';
    let questions = [];

    const con = mysql.createConnection(db);
    
    // con.connect(function(err) {
    //     if (err) {
    //         return console.error('error: ' + err.message);
    //     }
    //     console.log('Connected to the MySQL server.');
    // });

    con.query(query, async function (err, results,fields) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log("Question query executed");
        for(let i=0;i<results.length;i++){
            let myObject ={
                id: results[i]['question_id'] ,
                question:results[i]['content'] ,
                a:results[i]['option_A'] ,
                b:results[i]['option_B'],
                c:results[i]['option_C'],
                d:results[i]['option_D'],
                answer:results[i]['answer'],
            }
            questions.push(myObject);
        }
        await res.json(questions);
        con.end();
    });
});

app.get("/event/:eventId",function(req,res){ 
    let query = `select * from Events where event_id = ${req.params.eventId}`;
    let event = {};

    const con = mysql.createConnection(db);

    con.query(query, async function (err, results) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log("Event query executed");
        event.event_id = results[0].event_id;
        event.event_name = results[0].event_name;
        event.total_questions = results[0].total_questions;
        event.time_in_sec = results[0].time_in_sec;
        await res.json(event);
        con.end();
    });
});

app.get("/past-performance", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/past-performance', { data : {
            user : req.user
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/all-packages",function(req,res){
    res.render(__dirname +"/all-packages");
});

app.get("/test",function(req,res){
    res.render(__dirname +"/test");
});

app.get("/practice", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/practice', { data : {
            user : req.user
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/practice1", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/practice1', { data : {
            user : req.user
        }});
    }
    else {
        res.redirect('/login');
    }
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

app.get("/login",function(req,res){
    res.render(__dirname +"/login", { data: {}});
});

app.post("/login", authController.login);

app.get("/register",function(req,res){
    res.render(__dirname +"/register", { data: {}});
});

app.post("/register", authController.register);

app.get("/logout", authController.logout);

app.get("/forgetPassword",function(req,res){
    res.render(__dirname +"/forget-password");
});

app.post("/forgetPassword",function(req,res){
    console.log(req.body);
    res.send("Password changed");
});

app.post("/testFinished", function(req,res){
    console.log(req.body);
    res.send({});
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});





