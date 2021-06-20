const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const { db } = require('../constants');
const { promisify } = require('util');

exports.register = (req, res) => {
    try {
        const { name, email, contact, password, confirm_password } = req.body;

        const con = mysql.createConnection(db);

        let query = `select email from Users where email = "${email}"`;
        con.query(query, async (err, results) => {
            if (err) {
                console.log('error: ' + err.message);
                con.end();
                return res.status(500).render('../register', { data: { error_message: 'Something is wrong, please try again later'}});
            }
            if (results.length > 0){
                con.end();
                return res.render('../register', { data : { error_message: 'Entered email is already in use' }});
            } 
            else if ( password !== confirm_password ) {
                con.end();
                return res.render('../register', { data : { error_message: 'Passwords do not match'}});
            }
            else if ( password.length < 6 ) {
                con.end();
                return res.render('../register', { data : { error_message: 'Password length should be atleast 6'}});
            }
            else if ( contact.length !== 10 ) {
                con.end();
                return res.render('../register', { data : { error_message: 'Mobile number length should be 10'}});
            }
            let query1 = `insert into Users (name,email,contact,password,profile_verified,mode) values ("${name}","${email}","${contact}","${password}","false","free")`;
            con.query(query1, (err, results) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('../register', { data : { success_message: 'User Registered Successfully'}});
                }
            });
            con.end();
        });
    } catch (error) {
        console.log(error);
        con.end();
        res.status(500).render('../register', { data: { error_message: 'Something is wrong, please try again later'}});
    }
}

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        const con = mysql.createConnection(db);
    
        let query = `select * from Users where email = "${email}"`;
        con.query(query, async (err, results) => {
            if (err) {
                console.log(err);
                con.end();
                return res.status(500).render('../login', { data: { error_message: 'Something is wrong, please try again later'}});
            }
            if ( results.length == 0 || results[0].password !== password ) {
                con.end();
                res.status(401).render('../login', { data: { error_message: 'Invalid email or password'}});
            }
            else {
                const user_id = results[0].user_id;
                const token = jwt.sign({ user_id } , 'Vibgyor', {
                    expiresIn: '90d',
                });
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + (90 * 24 * 60 * 60 * 1000),
                    ),
                    httpOnly: true,
                }

                res.cookie('Vibgyor', token, cookieOptions);
                res.status(200).redirect('/dashboard');
                con.end();
            }
        });

    } catch (error) {
        console.log(error);
        con.end();
        res.status(500).render('../login', { data: { error_message: 'Something is wrong, please try again later'}});
    }
}

exports.isLoggedIn = async (req, res, next) => {
    if( req.cookies.Vibgyor ){
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.Vibgyor, 'Vibgyor');

            const con = mysql.createConnection(db);
            let query = `select * from Users where user_id = "${decoded.user_id}"`;
            con.query(query, async (err, results) => {
                req.user = results[0];
                con.end();
                return next();
            });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        next();
    }
}

exports.logout = async (req, res) => {
    res.cookie('Vibgyor', 'logout', {
        expires: new Date(
            Date.now() + 1
        ),
        httpOnly: true,
    });
    res.status(200).redirect('/login');
}