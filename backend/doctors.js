// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mysql = require('mysql');

// configuration =================
const db = mysql.createPool({
    connectionLimit : 2,
    host: 'remotemysql.com',
    user: 'Rr6RfuQQAh',
    password: '7cA4hntkbd',
    database: 'Rr6RfuQQAh',
    port: '3306'
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(8080);
console.log("App listening on port 8080");

app.post('/query', function (req, res) {
    db.query(req.body.query, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.get('/getDoctors', function (req, res) {
    db.query("SELECT * FROM doctor ORDER BY iddoctor", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/saveDoctor', function (req, res) {
    query = "INSERT INTO doctor(iddoctor, name, contactNo, fee, base_hospital, specialization, description) VALUES (?,?,?,?,?,?,?)";
    values = [req.body.iddoctor, req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/updateDoctor', function (req, res) {
    query = "UPDATE doctor SET name = ?, contactNo = ?, fee = ?, base_hospital = ?, specialization = ?, description = ? WHERE iddoctor = ? ";
    values = [req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description, req.body.iddoctor];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/deleteDoctor', function (req, res) {
    query = "DELETE FROM doctor  WHERE iddoctor = ? ";
    values = [req.body.iddoctor];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.get('/getNextDoctorId', function (req, res) {
    db.query("SELECT MAX(iddoctor) + 1 AS iddoctor FROM doctor", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            if (result[0].iddoctor == null) {
                result[0].iddoctor = 1;
            }
            res.json(result[0]);
        }
    });
});

app.post('/getAllDoctorScheduleByDoctor', function (req, res) {
    values = [req.body.iddoctor];
    //query = "SELECT * , DATE_FORMAT(datee , '%Y-%m-%d') as datee, DATE_FORMAT(datee , '%Y') as y , DATE_FORMAT(datee , '%m') as m, DATE_FORMAT(datee , '%d') as d  FROM doctor_schedule_new WHERE doctor_iddoctor = ? ORDER BY datee ASC";
    query = "SELECT * , unix_timestamp(doctor_in) as start , DATE_FORMAT(datee , '%Y') as y , DATE_FORMAT(datee , '%m') as m, DATE_FORMAT(datee , '%d') as d FROM doctor_schedule_new WHERE doctor_iddoctor = ? ORDER BY datee ASC";
    let time; 
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            result.forEach(element => {
                time = new Date(element.start * 1000);
                element.id = element.iddoctor_schedule;
                element.start = element.datee;
                element.start.setHours(time.getHours());
                element.start.setMinutes(time.getMinutes());
                element.start.setSeconds(time.getSeconds());
            });
            res.json(result);
        }
    });
});

app.post('/saveDoctorSchedule', function (req, res) {
    query = "INSERT INTO doctor_schedule_new(iddoctor_schedule, doctor_iddoctor, datee, doctor_in, doctor_out) VALUES (?,?,?,?,?)";
    values = [req.body.iddoctor_schedule, req.body.doctor.iddoctor, req.body.datee, req.body.doctor_in, req.body.doctor_out];
    console.log(values);
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/updateDoctorSchedule', function (req, res) {
    query = "UPDATE doctor_schedule_new SET datee = ?, doctor_in = ?, doctor_out = ? WHERE iddoctor_schedule = ? ";
    values = [req.body.datee, req.body.doctor_in, req.body.doctor_out, req.body.iddoctor_schedule];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/deleteDoctorSchedule', function (req, res) {
    query = "DELETE FROM doctor_schedule_new  WHERE iddoctor_schedule = ? ";
    values = [req.body.iddoctor_schedule];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.get('/getNextDoctorScheduleId', function (req, res) {
    db.query("SELECT MAX(iddoctor_schedule) + 1 AS iddoctor_schedule FROM doctor_schedule_new", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            if (result[0].iddoctor_schedule == null) {
                result[0].iddoctor_schedule = 1;
            }
            res.json(result[0]);
        }
    });
});

app.post('/getPatientsBySchedule', function (req, res) {
    values = [req.body.iddoctor_schedule];
    query = "SELECT * FROM appointment LEFT JOIN patient ON appointment.patient_idpatient = patient.idpatient WHERE appointment.iddoctor_schedule = ? order by appointment.number";
    let time; 
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});