const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require('mysql');
const authController = require("./controller/auth");
const cookieParser = require("cookie-parser");
const { db } = require("./constants");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +"/front-page", {
            data : {
                user : req.user,
                heading : "Homepage"
            }
        })
    }
    else {
        res.render(__dirname +"/front-page", {
            data : {
                heading : "Homepage"
            }
        })
    }
});

app.get("/dashboard", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/dashboard', { data : {
            user : req.user,
            heading : "Dashboard",
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/my-details", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/my-details', { data : {
            user : req.user,
            heading : "My Details",
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
        if(results.length>0){
            event.event_id = results[0].event_id;
            event.event_name = results[0].event_name;
            event.total_questions = results[0].total_questions;
            event.time_in_sec = results[0].time_in_sec;
        }
        await res.json(event);
        con.end();
    });
});

app.get("/past-performance", authController.isLoggedIn, function(req,res){
    
    if( req.user ){
        let query = `select E.event_name, A.attempt_id, A.total_score, A.your_score, A.total_questions, A.attempted, A.correct_answers, A.wrong_answers, A.date_attempted from Attempts A, Events E where E.event_id = A.event_id and user_id = "${req.user.user_id}"`;
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
                    your_score: results[i].your_score,
                    attempt_id: results[i].attempt_id
                });
            }
            res.render(__dirname +'/past-performance', { data : {
                user : req.user,
                attempts: attempts,
                heading : "Past Performance",
            }});
            con.end();
        });
    }
    else {
        res.redirect('/login');
    }
});

app.get("/past-performance-detailed/:attempt_id", authController.isLoggedIn, function(req,res){
    
    if( req.user ){
        let query = `select AN.attempt_id, E.event_name, Q.content, Q.answer as correct_answer, AN.answer as your_answer from Answers AN, Questions Q, Attempts ATT, Events E where AN.question_id = Q.question_id and ATT.event_id = E.event_id and ATT.attempt_id = AN.attempt_id and ATT.attempt_id = ${req.params.attempt_id} and ATT.user_id = ${req.user.user_id}`;
        let details = [];

        const con = mysql.createConnection(db);

        con.query(query, async function (err, results) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log("Answers fetching query executed");
            for(let i=0;i<results.length;i++){
                details.push({
                    attempt_id: results[i].attempt_id,
                    event_name: results[i].event_name,
                    question: results[i].content,
                    correct_answer: results[i].correct_answer,
                    your_answer: results[i].your_answer,
                });
            }
            res.render(__dirname +'/past-performance-detailed', { data : {
                user : req.user,
                details: details,
                heading : "Past Performance Detailed",
            }});
            con.end();
        });
    }
    else {
        res.redirect('/login');
    }
});

app.get("/all-packages", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/all-packages', { data : {
            user : req.user,
            heading: "All Packages"
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/practice", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +'/practice', { data : {
            user : req.user,
            heading: "Practice Demo"
        }});
    }
    else {
        res.redirect('/login');
    }
});

app.get("/my-packages", authController.isLoggedIn, function(req,res){
    if( req.user ){
        let query = `select P.event_id, E.event_name from Packages P, Events E where P.event_id = E.event_id and user_id = ${req.user.user_id}`;
        let events = [];

        const con = mysql.createConnection(db);

        con.query(query, async function (err, results) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log("Packages fetching query executed");
            for(let i=0;i<results.length;i++){
                events.push({
                    event_id:results[i].event_id,
                    event_name:results[i].event_name,
                });
            }
            res.render(__dirname +'/my-packages', { data : {
                user : req.user,
                events: events,
                heading: "My Packages"
            }});
            con.end();
        });
    }
    else {
        res.redirect('/login');
    }
});

app.get("/basic",function(req,res){
    res.render(__dirname +"/basic");
});

app.get("/layout-static",function(req,res){
    res.render(__dirname +"/layout-static");
});

app.get("/pay",function(req,res){
    res.render(__dirname +"/pay")
});

app.get("/login",function(req,res){
    res.render(__dirname +"/login", {
        data: {
            heading: "Log In"
        },
    });
});

app.post("/login", authController.login);

app.get("/register",function(req,res){
    res.render(__dirname +"/register", { 
        data: {
            heading: "Registration"
        },
    });
});

app.post("/register", authController.register);

app.get("/logout", authController.logout);

app.get("/change-password", authController.isLoggedIn, function(req,res){
    if( req.user ){
        res.render(__dirname +"/change-password", {
            data: {
                user_id: req.user.user_id,
                heading: "Change Password"
            },
        });
    }
    else {
        res.redirect('/login');
    }
});

app.post("/change-password", authController.changePassword);

app.get("/forgetPassword",function(req,res){
    res.render(__dirname +"/forget-password");
});

app.post("/forgetPassword",function(req,res){
    console.log(req.body);
    res.send("Password changed");
});

app.get("/exp",function(req,res){
    res.render(__dirname +"/exp");
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





