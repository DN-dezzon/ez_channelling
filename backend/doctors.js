// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mysql = require('mysql');

// configuration =================
const db = mysql.createConnection ({
    // host: 'remotemysql.com',
    // user: 'Rr6RfuQQAh',
    // password: '7cA4hntkbd',
    // database: 'Rr6RfuQQAh',
    // port: '3306'
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shanthi_medical',
    port: '3307'
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(8080);
console.log("App listening on port 8080");

app.post('/query', function (req, res) {
    db.query(req.body.query, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result);
        }
    });
});


// doctor by madhava

app.get('/getDoctors', function (req, res) {
    db.query("SELECT * FROM doctor ORDER BY iddoctor", (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result);
        }
    });
});

app.post('/saveDoctor', function (req, res) {
    query = "INSERT INTO doctor(iddoctor, name, contactNo, fee, base_hospital, specialization, description) VALUES (?,?,?,?,?,?,?)";
    values = [req.body.iddoctor, req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});

app.post('/updateDoctor', function (req, res) {
    query = "UPDATE doctor SET name = ?, contactNo = ?, fee = ?, base_hospital = ?, specialization = ?, description = ? WHERE iddoctor = ? ";
    values = [req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description, req.body.iddoctor];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});

app.post('/deleteDoctor', function (req, res) {
    query = "DELETE FROM doctor  WHERE iddoctor = ? ";
    values = [req.body.iddoctor];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});


// Patients by chathuri

app.get('/getPatients', function (req, res) {
    query ="SELECT * FROM patient ORDER BY idpatient";
         db.query(query, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result);
        }
    });
});


app.post('/savePatient', function (req, res) {
    query = "INSERT INTO patient(idpatient, name, contactNo) VALUES (?,?,?)";
    values = [req.body.idpatient, req.body.name, req.body.contactNo];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});
app.post('/updatePatient', function (req, res) {
    query = "UPDATE patient SET name = ?, contactNo = ? WHERE idpatient = ? ";
    values = [req.body.name, req.body.contactNo, req.body.idpatient];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});

app.post('/deletePatient', function (req, res) {
    query = "DELETE FROM patient  WHERE idpatient = ? ";
    values = [req.body.idpatient];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500,err);
        }else{
            res.json(result.affectedRows);
        }
    });
});

app.get('/getPatientHistory', function (req, res) {
    query ="SELECT * From patient as p inner join appointment as a on p.idpatient=a.patient_idpatient inner join doctor_schedule as ds on ds.iddoctor_schedule=a.iddoctor_schedule inner join doctor as d on d.iddoctor=ds.doctor_iddoctor where p.idpatient=?";
    // values = [req.body.idpatient];
    values =1;
    db.query(query, values,(err, result) => { 
        if (err) {
            res.send(500,err);
        }else{ 
            res.json(result);
        }
    });
});


//Home 

app.get('/getPatientbyId', function (req, res) {
    query ="SELECT * From patient  where idpatient=?";
    // values = [req.body.idpatient]; 
    values=1;
    db.query(query, values,(err, result) => { 
        if (err) {
            res.send(500,err);
        }else{ 
            res.json(result);
        }
    });
});

app.get('/getDoctortbyId', function (req, res) {
    query ="SELECT * From doctor  where iddoctor=?";
    // values = [req.body.idpatient]; 
    values=1;
    db.query(query, values,(err, result) => { 
        if (err) {
            res.send(500,err);
        }else{ 
            res.json(result);
        }
    });
});