// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mysql = require('mysql');

// configuration =================
const db = mysql.createPool({
    connectionLimit: 2,
    host: 'remotemysql.com',
    user: 'Rr6RfuQQAh',
    password: '7cA4hntkbd',
    database: 'Rr6RfuQQAh',
    port: '3306'
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'shanthi_medical',
    // port: '3307'
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


// doctor by madhava

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


// Patients by chathuri

app.get('/getPatients', function (req, res) {
    query = "SELECT * FROM patient ORDER BY idpatient";
    db.query(query, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});


app.post('/savePatient', function (req, res) {
    query = "INSERT INTO patient(idpatient, name, contactNo) VALUES (?,?,?)";
    values = [req.body.idpatient, req.body.name, req.body.contactNo];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});
app.post('/updatePatient', function (req, res) {
    query = "UPDATE patient SET name = ?, contactNo = ? WHERE idpatient = ? ";
    values = [req.body.name, req.body.contactNo, req.body.idpatient];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/deletePatient', function (req, res) {
    query = "DELETE FROM patient  WHERE idpatient = ? ";
    values = [req.body.idpatient];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/getPatientHistory', function (req, res) {
    query = "SELECT * From patient as p inner join appointment as a on p.idpatient=a.patient_idpatient inner join doctor_schedule as ds on ds.iddoctor_schedule=a.iddoctor_schedule inner join doctor as d on d.iddoctor=ds.doctor_iddoctor where p.idpatient=?";
    values = [req.body.idpatient];
    // values =1;
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});


//Home 

app.get('/getPatientbyId', function (req, res) {
    query = "SELECT * From patient  where idpatient=?";
    // values = [req.body.idpatient]; 
    values = 1;
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getDoctortbyId', function (req, res) {
    query = "SELECT * From doctor  where iddoctor=?";
    values = [req.body.iddoctor];
    // values=1;
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});
app.post('/getAppointMentNumber', function (req, res) {
    query = "SELECT count(number) as count FROM  doctor_schedule d inner join appointment a on d.iddoctor_schedule=a.iddoctor_schedule where d.doctor_iddoctor=? and d.datee=? and a.payment_status!='Cancelled'";
    values = [req.body.iddoctor, req.body.datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getScheduleIdId', function (req, res) {
    query = "SELECT DISTINCT d.iddoctor_schedule  FROM  doctor_schedule d inner join appointment a on d.iddoctor_schedule=a.iddoctor_schedule where d.doctor_iddoctor=? and d.datee=? and a.payment_status!='Cancelled'";
    values = [req.body.iddoctor, req.body.datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});
app.post('/saveAppointment', function (req, res) {
    var d = new Date();
    if (req[1].body.newpatient == "yes") {
        query = "INSERT INTO patient(idpatient, name, contactNo) VAcdLUES (?,?,?)";
        values = [req[0].body.idpatient, req[0].body.name, req[0].body.contactNo];
        db.query(query, values, (err, result) => {
            if (err) {
                res.send(500, err);
            } else {
                // Make an appointment
                query2 = "INSERT INTO appointment(number, payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?)";
                values = [req[1].body.number, req[1].body.PrintActivateStatus, req[1].body.iddoctor_schedule, req[0].body.idpatient, d];
                db.query(query2, values, (err, result) => {
                    if (err) {
                        res.send(500, err);
                    } else {
                        if (req[1].body.PrintActivateStatus == "Paid") {
                            // Make a payment 
                            query3 = "INSERT INTO patient_invoice(amount, id_appointment,issued_datetime) VALUES (?,?,?)";
                            values = [req[1].body.fee, result.insertId, d];
                            db.query(query3, values, (err, result) => {
                                if (err) {
                                    res.send(500, err);
                                } else {
                                    res.json(result);
                                }
                            });
                        }
                    }
                });
            }
        });
    } else {
        // Make an appointment
        query2 = "INSERT INTO appointment(number, payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?)";
        values = [req[1].body.number, req[1].body.PrintActivateStatus, req[1].body.iddoctor_schedule, req[0].body.idpatient, d];
        db.query(query2, values, (err, result) => {
            if (err) {
                res.send(500, err);
            } else {
                if (req[1].body.PrintActivateStatus == "Paid") {
                    // Make a payment 
                    query3 = "INSERT INTO patient_invoice(amount, id_appointment,issued_datetime) VALUES (?,?,?)";
                    values = [req[1].body.fee, result.insertId, d];
                    db.query(query3, values, (err, result) => {
                        if (err) {
                            res.send(500, err);
                        } else {
                            res.json(result);
                        }
                    });
                }
            }
        });
    }
    
    //    Make an appointment
    // query2 = "INSERT INTO appointment(number, payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?)";

    // // Make a payment 
    // query2 = "INSERT INTO patient_invoice(amount, id_appointment,issued_datetime) VALUES (?,?,?)";



});

app.post('/getTodaySchedule', function (req, res) {
    query = "SELECT * FROM doctor_schedule ds inner join doctor d on ds.doctor_iddoctor=d.iddoctor where ds.datee=?";
    values = [req.body.datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.get('/getPatientIncome', function (req, res) {
    query = "SELECT sum(amount) as sum FROM patient_invoice where DATE(issued_datetime) = CURDATE()";
    db.query(query, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.get('/getPatientIncomeMonthly', function (req, res) {
    var d = new Date();
    var n = d.getMonth();
    query = "SELECT sum(amount) as monthlytot FROM patient_invoice where MONTH(issued_datetime)=?";
    values = n + 1;
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getPatientByContactNo', function (req, res) {
    query = "SELECT * From patient  where contactNo=?";
    values = [req.body.contactNo];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
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
    //query = "SELECT * , DATE_FORMAT(datee , '%Y-%m-%d') as datee, DATE_FORMAT(datee , '%Y') as y , DATE_FORMAT(datee , '%m') as m, DATE_FORMAT(datee , '%d') as d  FROM doctor_schedule WHERE doctor_iddoctor = ? ORDER BY datee ASC";
    query = "SELECT * , unix_timestamp(doctor_in) as start , DATE_FORMAT(datee , '%Y') as y , DATE_FORMAT(datee , '%m') as m, DATE_FORMAT(datee , '%d') as d FROM doctor_schedule WHERE doctor_iddoctor = ? ORDER BY datee ASC";
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
    query = "INSERT INTO doctor_schedule(iddoctor_schedule, doctor_iddoctor, datee, doctor_in, doctor_out) VALUES (?,?,?,?,?)";
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
    query = "UPDATE doctor_schedule SET datee = ?, doctor_in = ?, doctor_out = ? WHERE iddoctor_schedule = ? ";
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
    query = "DELETE FROM doctor_schedule  WHERE iddoctor_schedule = ? ";
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
    db.query("SELECT MAX(iddoctor_schedule) + 1 AS iddoctor_schedule FROM doctor_schedule", (err, result) => {
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
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getUser', function (req, res) {
    values = [req.body.uname, req.body.passwd];
    query = "SELECT * FROM user LEFT JOIN user_type ON user.iduser_type = user_type.iduser_type WHERE user.uname = ? AND user.passwd = ?";
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});
app.post('/getUserdata', function (req, res) {
    values = [req.body.iduser];
    query = "SELECT * FROM user WHERE user.iduser = ?";
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});
app.get('/getChannellingFee', function (req, res) {
    db.query("SELECT valuee as fee FROM configuration WHERE keyy = 'fee'", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.post('/updateCenterFee', function (req, res) {
    values = [req.body.fee];
    db.query("UPDATE configuration SET valuee = ? WHERE keyy = 'fee'", values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/updateUser', function (req, res) {
    values = [req.body.name, req.body.password, req.body.iduser];
    db.query("UPDATE user SET name = ? , passwd = ? WHERE iduser = ? ", values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});


app.get('/getUserDetails', function (req, res) {
    db.query("SELECT valuee as fee FROM configuration WHERE keyy = 'fee'", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/getNextPatientId', function (req, res) {
    db.query("SELECT MAX(idpatient) + 1 AS idpatient FROM patient", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            if (result[0].idpatient == null) {
                result[0].idpatient = 1;
            }
            res.json(result[0]);
        }
    });
});