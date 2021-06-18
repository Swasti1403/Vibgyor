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
    let query = `select * from Events where event_id = "${req.params.eventId}"`;
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
        let query = `select E.event_name, A.total_score, A.your_score, A.total_questions, A.attempted, A.correct_answers, A.wrong_answers, A.date_attempted from Attempts A, Events E where E.event_id = A.event_id and user_id = "${req.user.user_id}"`;
        let attempts = [];

        const con = mysql.createConnection(db);

        con.query(query, async function (err, results) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log("Attempts fetching query executed");
            for(let i=0;i<results.length;i++){
                attempts.push({
                    event_name: results[i].event_name,
                    date_time: JSON.stringify(results[i].date_attempted).slice(1,11) + " " + JSON.stringify(results[i].date_attempted).slice(12,20),
                    total_questions: results[i].total_questions,
                    attempted: results[i].attempted,
                    correct_answers: results[i].correct_answers,
                    wrong_answers: results[i].wrong_answers,
                    total_score: results[i].total_score,
                    your_score: results[i].your_score
                });
            }
            res.render(__dirname +'/past-performance', { data : {
                user : req.user,
                attempts: attempts,
            }});
            con.end();
        });
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
    let my_date = new Date(new Date().getTime()+(360*60*1000));
    query_date = `${my_date.getFullYear()}-${my_date.getMonth()}-${my_date.getDate()} ${my_date.getHours()}:${my_date.getMinutes()}:${my_date.getSeconds()}`;
    const { user_id, event_id, total_questions, attempted, correct_answers, wrong_answers, score, total_score, answers} = req.body;
    let query = `insert into Attempts (user_id,event_id,total_score,your_score,total_questions,attempted,correct_answers,wrong_answers,date_attempted) values (${user_id},"${event_id}",${total_score},${score},${total_questions},${attempted},${correct_answers},${wrong_answers},"${query_date}")`;

    const con = mysql.createConnection(db);

    con.query(query, async function (err, results) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log("Attempts set query executed");
        query1 = "insert into Answers (question_id, attempt_id, answer) values";
        for(let i=0;i<answers.length;i++){
            query1+=`(${answers[i].question_id},${results.insertId},${answers[i].answer}),`;
        }
        query1 = query1.slice(0,query1.length-1);
        con.query(query1, async function (err, results) {
            if (err) {
                return console.error('error: ' + err.message);
            }
        });
        con.end();
    });
    res.send({});
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});





