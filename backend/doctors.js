// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mysql = require('mysql');

const http = require('http');
const fs = require('fs');
const carbone = require('carbone');

const { exec } = require('child_process');

// configuration =================
const db = mysql.createPool({
    connectionLimit: 100,
    // host: 'localhost',
    // user: 'root',
    // password: 'aelo',
    // database: 'shanthi',
    // port: '3306'
    // host: 'remotemysql.com',
    // user: 'Rr6RfuQQAh',
    // password: '7cA4hntkbd',
    // database: 'Rr6RfuQQAh',
    // port: '3306'
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shanthi',
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
    query = "INSERT INTO doctor(iddoctor, name, contactNo, fee, base_hospital, specialization, description, con_period) VALUES (?,?,?,?,?,?,?,?)";
    values = [req.body.iddoctor, req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description, req.body.con_period];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/updateDoctor', function (req, res) {
    query = "UPDATE doctor SET name = ?, contactNo = ?, fee = ?, base_hospital = ?, specialization = ?, description = ?, con_period = ? WHERE iddoctor = ? ";
    values = [req.body.name, req.body.contactNo, req.body.fee, req.body.base_hospital, req.body.specialization, req.body.description, req.body.con_period, req.body.iddoctor];
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

app.post('/searchAppointment', function (req, res) {
    query = "SELECT * From appointment as a inner join patient as p on a.patient_idpatient=p.idpatient  where iddoctor_schedule=? and patient_idpatient=?";
    values = [req.body.iddoctor_schedule, req.body.idpatient];
    // values=1;
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});
app.get('/getPatientbyMobile', function (req, res) {
    query = "SELECT * From patient  where contactNo=?";
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
    query = "SELECT count(a.idappointment) as count FROM  doctor_schedule d inner join appointment a on d.iddoctor_schedule=a.iddoctor_schedule where d.doctor_iddoctor=? and d.datee=? and a.payment_status!='Cancelled'";
    values = [req.body.iddoctor, req.body.datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getTimePeroid', function (req, res) {
    query = "SELECT * FROM  doctor_schedule d inner join doctor as doc on d.doctor_iddoctor=doc.iddoctor where d.doctor_iddoctor=? and d.datee=?";
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
    if (req.body.paient.newpatient == "yes") {
        var p_id = "0";
        query_p_count = "SELECT * from patient";

        db.query(query_p_count, (err, result) => {
            if (err) {
                res.send(500, err);
            } else {
                p_id = result.length;
                query = "INSERT INTO patient( idpatient,name, contactNo) VALUES (?,?,?)";
                values = [p_id, req.body.paient.name, req.body.paient.contactNo];
                db.query(query, values, (err, result) => {
                    if (err) {
                        res.send(500, err);
                    } else {

                        // Make an appointment
                        query2 = "INSERT INTO appointment(number,patient_intime, payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)";
                        values = [req.body.number, req.body.patient_intime, req.body.payment_status, req.body.doctor_schedule.iddoctor_schedule, p_id, d];

                        db.query(query2, values, (err, result) => {
                            if (err) {
                                res.send(500, err);
                            } else {
                                if (req.body.payment_status == "Paid") {

                                    // Make a payment 
                                    query3 = "INSERT INTO patient_invoice(amount, idappointment,issued_datetime) VALUES (?,?,CURRENT_TIMESTAMP)";
                                    values = [req.body.doctor.fee, result.insertId, d];
                                    db.query(query3, values, (err, result) => {
                                        if (err) {
                                            res.send(500, err);
                                        } else {
                                            res.json(result.insertId);
                                        }
                                    });
                                } else {
                                    res.json(result);
                                }
                            }
                        });
                    }
                });
            }
        });
    } else {
        // Make an appointment

        query2 = "INSERT INTO appointment(number, patient_intime,payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)";
        values = [req.body.number, req.body.patient_intime, req.body.payment_status, req.body.doctor_schedule.iddoctor_schedule, req.body.paient.idpatient, d];

        db.query(query2, values, (err, result) => {
            if (err) {
                res.send(500, err);
            } else {

                if (req.body.payment_status == "Paid") {
                    // Make a payment 
                    query3 = "INSERT INTO patient_invoice(amount, idappointment,issued_datetime) VALUES (?,?,CURRENT_TIMESTAMP)";
                    values = [req.body.doctor.fee, result.insertId, d];
                    db.query(query3, values, (err, result) => {
                        if (err) {
                            res.send(500, err);
                        } else {
                            res.json(result.insertId);
                        }
                    });
                } else {
                    res.json(result);
                }
            }
        });
    }
    // Register customer if not exist


    //    Make an appointment
    // query2 = "INSERT INTO appointment(number, payment_status,iddoctor_schedule,patient_idpatient,issued_datetime) VALUES (?,?,?,?,?)";

    // // Make a payment 
    // query2 = "INSERT INTO patient_invoice(amount, id_appointment,issued_datetime) VALUES (?,?,?)";



});

app.post('/makePayment', function (req, res) {
    var d = new Date();
    query2 = "UPDATE appointment set payment_status=? where idappointment=?";
    values = ['Paid', req.body.idappointment];
    db.query(query2, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            query3 = "INSERT INTO patient_invoice(amount, idappointment,issued_datetime) VALUES (?,?,CURRENT_TIMESTAMP)";
            values = [req.body.doctor.fee, req.body.idappointment, d];
            db.query(query3, values, (err, result) => {
                if (err) {
                    res.send(500, err);
                } else {
                    res.json(result.insertId);
                }
            });
        }
    });

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

function tConvert(timeString) {
    var H = +timeString.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    return h + timeString.substr(2, 3) + ampm;
}

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
                element.allDay = true;
                time = new Date(element.start * 1000);
                element.id = element.iddoctor_schedule;
                element.start = element.datee;
                element.start.setHours(time.getHours());
                element.start.setMinutes(time.getMinutes());
                element.start.setSeconds(time.getSeconds());
                element.title = tConvert(element.doctor_in);
            });
            res.json(result);
        }
    });
});

app.post('/saveDoctorSchedule', function (req, res) {
    query = "INSERT INTO doctor_schedule(iddoctor_schedule, doctor_iddoctor, datee, doctor_in, doctor_out) VALUES (?,?,?,?,?)";
    values = [req.body.iddoctor_schedule, req.body.doctor.iddoctor, req.body.datee, req.body.doctor_in, req.body.doctor_out];
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
    //query = "SELECT * FROM patient_invoice LEFT JOIN appointment ON patient_invoice.idappointment = appointment.idappointment  LEFT JOIN patient ON appointment.patient_idpatient = patient.idpatient WHERE appointment.iddoctor_schedule = ? order by appointment.number";
    query = "SELECT * FROM  appointment LEFT JOIN patient ON appointment.patient_idpatient = patient.idpatient WHERE appointment.iddoctor_schedule = ? order by appointment.number";
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getPendingPatientCountBySchedule', function (req, res) {
    values = [req.body.iddoctor_schedule];
    query = "SELECT count(*) as patient_count FROM appointment WHERE iddoctor_schedule = ? AND payment_status = 'Pending'";
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.post('/getCancelledPatientCountBySchedule', function (req, res) {
    values = [req.body.iddoctor_schedule];
    query = "SELECT count(*) as patient_count FROM appointment WHERE iddoctor_schedule = ? AND payment_status = 'Cancelled'";
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
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
    values = [req.body.name, req.body.passwd, req.body.iduser];
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


app.get('/getNextDoctorInvoiceId', function (req, res) {
    db.query("SELECT MAX(iddoctor_invoice) + 1 AS iddoctor_invoice FROM doctor_invoice", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            if (result[0].iddoctor_invoice == null) {
                result[0].iddoctor_invoice = 1;
            }
            res.json(result[0]);
        }
    });
});

app.post('/updateDoctorInvoice', function (req, res) {
    values = [req.body.patient_count, req.body.center_fee, req.body.doc_fee, req.body.status, req.body.iddoctor_invoice];
    db.query("UPDATE doctor_invoice SET datee = CURRENT_TIMESTAMP , patient_count = ?, center_fee = ? , doc_fee = ? , status = ? WHERE iddoctor_invoice = ? ", values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/getDoctrInvoiceByDoctorSchedule', function (req, res) {
    values = [req.body.iddoctor_schedule];
    db.query("SELECT * , DATE_FORMAT(datee , '%Y') as y , DATE_FORMAT(datee , '%m') as m, DATE_FORMAT(datee , '%d') as d FROM doctor_invoice WHERE doctor_schedule_iddoctor_schedule = ? ", values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.post('/saveDoctorInvoice', function (req, res) {
    query = "INSERT INTO doctor_invoice( iddoctor_invoice , datee , patient_count, center_fee, doc_fee, doctor_schedule_iddoctor_schedule, status) VALUES (?, CURRENT_TIMESTAMP ,?,?,?,?, 'Paid')";
    values = [req.body.iddoctor_invoice, req.body.patient_count, req.body.center_fee, req.body.doc_fee, req.body.doctor_schedule.iddoctor_schedule];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/deleteDoctorInvoice', function (req, res) {
    query = "DELETE FROM doctor_invoice WHERE iddoctor_invoice = ?";
    values = [req.body.iddoctor_invoice];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/getDoctorReport', function (req, res) {
    query = `SELECT 
    COUNT(patient_invoice.idpatient_invoice) AS patient_count ,
    SUM(patient_invoice.doctor_fee) AS doc_fee ,
    SUM(patient_invoice.center_fee) AS center_fee 
    FROM patient_invoice 
    LEFT JOIN appointment ON appointment.idappointment = patient_invoice.idappointment 
    LEFT JOIN doctor_schedule ON doctor_schedule.iddoctor_schedule = appointment.iddoctor_schedule
    LEFT JOIN doctor ON doctor.iddoctor = doctor_schedule.doctor_iddoctor
    WHERE appointment.payment_status = 'Paid' AND doctor.iddoctor = ? AND doctor_schedule.datee BETWEEN ? AND ?`;
    values = [req.body.doctor.iddoctor, req.body.from_datee, req.body.to_datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.post('/getTransactions', function (req, res) {
    query = "";

    if (req.body.income && req.body.expenses) {
        query = `
    SELECT  DATE_FORMAT(date, '%m/%d/%Y') as date , id , name , status , expense , income , tablee
        FROM
        (
            SELECT 
                doctor_invoice.datee as date ,
                doctor_invoice.iddoctor_invoice as id,
                doctor.name as name,
                doctor_invoice.status as status,
                (doctor_invoice.doc_fee * doctor_invoice.patient_count) as expense,
                0 as income,
                "doctor_invoice" as tablee
                FROM doctor_invoice 
                left join doctor_schedule on doctor_schedule.iddoctor_schedule = doctor_invoice.doctor_schedule_iddoctor_schedule
                left join doctor on doctor.iddoctor = doctor_schedule.doctor_iddoctor 
                WHERE DATE(doctor_invoice.datee) BETWEEN ? AND ?
            UNION
            SELECT 
                patient_invoice.issued_datetime as date ,
                patient_invoice.idpatient_invoice as id ,
                patient.name as name ,
                appointment.payment_status as status,
                0 as expense,
                patient_invoice.amount as income,
                "patient_invoice" as tablee
                FROM patient_invoice 
                LEFT JOIN appointment ON appointment.idappointment = patient_invoice.idappointment 
                LEFT JOIN patient ON patient.idpatient = appointment.patient_idpatient
                WHERE DATE(patient_invoice.issued_datetime) BETWEEN ? AND ?
        )    as t1
        where status in ('Paid','Cancelled')
        order by date desc
    `;
    } else if (req.body.income) {
        query = `
    SELECT  DATE_FORMAT(date, '%m/%d/%Y') as date , id , name , status , expense , income , tablee
        FROM
        (
            SELECT 
                patient_invoice.issued_datetime as date ,
                patient_invoice.idpatient_invoice as id ,
                patient.name as name ,
                appointment.payment_status as status,
                0 as expense,
                patient_invoice.amount as income,
                "patient_invoice" as tablee
                FROM patient_invoice 
                LEFT JOIN appointment ON appointment.idappointment = patient_invoice.idappointment 
                LEFT JOIN patient ON patient.idpatient = appointment.patient_idpatient
                WHERE DATE(patient_invoice.issued_datetime) BETWEEN ? AND ?
        )    as t1
        where status in ('Paid','Cancelled')
        order by date desc
    `;
    } else if (req.body.expenses) {
        query = `
    SELECT  DATE_FORMAT(date, '%m/%d/%Y') as date , id , name , status , expense , income , tablee
        FROM
        (
            SELECT 
                doctor_invoice.datee as date ,
                doctor_invoice.iddoctor_invoice as id,
                doctor.name as name,
                doctor_invoice.status as status,
                (doctor_invoice.doc_fee * doctor_invoice.patient_count) as expense,
                0 as income,
                "doctor_invoice" as tablee
                FROM doctor_invoice 
                left join doctor_schedule on doctor_schedule.iddoctor_schedule = doctor_invoice.doctor_schedule_iddoctor_schedule
                left join doctor on doctor.iddoctor = doctor_schedule.doctor_iddoctor 
                WHERE DATE(doctor_invoice.datee) BETWEEN ? AND ?
        )    as t1
        where status in ('Paid','Cancelled')
        order by date desc
    `;
    }


    values = [req.body.from_datee, req.body.to_datee, req.body.from_datee, req.body.to_datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});


app.post('/getIncome', function (req, res) {
    query = `
    SELECT  DATE_FORMAT(date, '%m/%d/%Y') as date , id , name , status  , income , tablee
        FROM
        (
           
            SELECT 
                patient_invoice.issued_datetime as date ,
                patient_invoice.idpatient_invoice as id ,
                patient.name as name ,
                appointment.payment_status as status,
                0 as expense,
                patient_invoice.amount as income,
                "patient_invoice" as tablee
                FROM patient_invoice 
                LEFT JOIN appointment ON appointment.idappointment = patient_invoice.idappointment 
                LEFT JOIN patient ON patient.idpatient = appointment.patient_idpatient
                WHERE DATE(patient_invoice.issued_datetime) BETWEEN ? AND ?
        )    as t1
        where status in ('Paid','Cancelled')
        order by date desc
    `;
    values = [req.body.from_datee, req.body.to_datee, req.body.from_datee, req.body.to_datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/getExpenses', function (req, res) {
    query = `
    SELECT  DATE_FORMAT(date, '%m/%d/%Y') as date , id , name , status , expense , income , tablee
        FROM
        (
            SELECT 
                doctor_invoice.datee as date ,
                doctor_invoice.iddoctor_invoice as id,
                doctor.name as name,
                doctor_invoice.status as status,
                (doctor_invoice.doc_fee * doctor_invoice.patient_count) as expense,
                0 as income,
                "doctor_invoice" as tablee
                FROM doctor_invoice 
                left join doctor_schedule on doctor_schedule.iddoctor_schedule = doctor_invoice.doctor_schedule_iddoctor_schedule
                left join doctor on doctor.iddoctor = doctor_schedule.doctor_iddoctor 
                WHERE DATE(doctor_invoice.datee) BETWEEN ? AND ? 
        )    as t1
        where status in ('Paid','Cancelled')
        order by date desc
    `;
    values = [req.body.from_datee, req.body.to_datee, req.body.from_datee, req.body.to_datee];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

app.post('/deleteTransaction', function (req, res) {
    query = "DELETE FROM patient_invoice  WHERE idpatient_invoice = ? ";
    if (req.body.tablee == "doctor_invoice") {
        query = "DELETE FROM doctor_invoice WHERE iddoctor_invoice = ?";
    }
    values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/cancelTransaction', function (req, res) {
    query = "update appointment set payment_status = 'Cancelled' WHERE idappointment =     (SELECT idappointment from patient_invoice where idpatient_invoice = ?)";
    if (req.body.tablee == "doctor_invoice") {
        query = "UPDATE doctor_invoice SET status = 'Cancelled' WHERE iddoctor_invoice = ?";
    }
    values = [req.body.id];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.post('/isDoctorDeletable', function (req, res) {
    query = "SELECT count(doctor_iddoctor) as doctor_count FROM doctor_schedule WHERE doctor_iddoctor = ?";
    values = [req.body.iddoctor];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0].doctor_count == 0);
        }
    });
});

app.post('/isDoctorScheduleDeletable', function (req, res) {
    query = "SELECT count(iddoctor_schedule) as schedule_count FROM appointment WHERE iddoctor_schedule = ?";
    values = [req.body.iddoctor_schedule];
    db.query(query, values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0].schedule_count == 0);
        }
    });
});


app.get('/getPrinterName', function (req, res) {
    db.query("SELECT valuee as name FROM configuration WHERE keyy = 'printer'", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result[0]);
        }
    });
});

app.post('/updatePrinterName', function (req, res) {
    values = [req.body.name];
    db.query("UPDATE configuration SET valuee = ? WHERE keyy = 'printer'", values, (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result.affectedRows);
        }
    });
});

app.get('/getCenterFee', function (req, res) {
    db.query("SELECT valuee FROM configuration WHERE keyy = 'fee'", (err, result) => {
        if (err) {
            res.send(500, err);
        } else {
            res.json(result);
        }
    });
});

 





//
// ////////////////////////////
//
// var printOptions = {
//     convertTo: 'pdf', //can be docx, txt, ...
// };
//
// function print(template, data, res) {
//     carbone.render('templates/' + template, data, printOptions, function (err, result) {
//         if (err) {
//             if (res) res.send(500, err);
//         } else {
//             fs.writeFileSync('out.pdf', result);
//             if (res) res.status(200).send("printed");
//             //printing code here
//             fs.unlinkSync('out.pdf')
//         }
//     });
// }
//
// function printFromUrl(template, data, res) {
//
//     const file = fs.createWriteStream("tmp/tmp");
//     const request = http.get("http://localhost/" + template, function (response) {
//         response.pipe(file);
//         print("tmp/tmp", data, res);
//
//     });
//
// }
//
// var pdata = {
//     medicalCenter: {
//         name: "Shanthi Medical Home",
//         phone: "(031) 2256525",
//         no: "No. 600/10",
//         street: "",
//         city: "Katana",
//         email: "",
//     },
//
//     product: {
//         name: "EZ Channeling",
//         tech: "EZ_Channeling",
//         short: "EZ+",
//         version: "1.0.0",
//         description: "Perfectly designed and precisely prepared electronic channelling system.",
//     },
//
//     company: {
//         name: "iNAC",
//         phone: "12345678",
//         no: "456/140",
//         street: "jabeer rd",
//         cirty: "colombo",
//         email: "hello.inac@gmail.com",
//         copyright: "2019-2020",
//     }
// }
// var data = {
//     firstname: 'John',
//     lastname: 'Doe',
//     cars: [
//         { "brand": "Lumeneo" },
//         { "brand": "Tesla" },
//         { "brand": "Toyota" },
//         { "brand": "Lumeneo" },
//         { "brand": "Tesla" },
//         { "brand": "Toyota" },
//         { "brand": "Lumeneo" },
//         { "brand": "Tesla" },
//         { "brand": "Toyota" }
//     ]
// };
//
// app.get('/testPrint', function (req, res) {
//
//     print('simple.odt', data, res);
//
// });

////////////////////////////

var printOptions = {
    convertTo: 'pdf', //can be docx, txt, ...
};

function print(file,data,res,sendToPrinter) {
    carbone.render(file, data, printOptions, function (err, result) {
        if (err){
            if(res) res.send(500, err);
        }else{
            fs.writeFileSync('out.pdf', result);

            if(sendToPrinter) {

                db.query("SELECT valuee as name FROM configuration WHERE keyy = 'printer'", (err, result) => {
                    if (err) {
                        res.send(500, err);
                    } else {
                        exec('soffice --pt ' + result[0].name + ' out.pdf', (err, stdout, stderr) => {
                            if (err || stderr) {
                                // node couldn't execute the command
                                res.send(500, err);
                                return;
                            }

                            // the *entire* stdout and stderr (buffered)
                            console.log(`stdout: ${stdout}`);
                            console.log(`stderr: ${stderr}`);
                        });

                        if (res) res.json("printed");
                    }
                });
            }
            //printing code here
            //fs.unlinkSync('out.pdf')
        }
    });
}

function printFromUrl(template,data,res,sendToPrinter) {
    const file = fs.createWriteStream("tmp/tmp");
    const request = http.get("http://localhost:4200/assets/templates/" + template , function(response) {
        response.pipe(file);
        print("tmp/tmp",data,res,sendToPrinter);
    });
}

var pdata = {
    medicalCenter : {
        name: "Shanthi Medical Home",
        phone: "(031) 2241836",
        no: "No. 210/1/C",
        street: "Negombo Rd",
        city: "Katana",
        email: "",
    },

    product : {
        name: "EZ Channeling",
        tech: "EZ_Channeling",
        short: "EZ+",
        version: "1.0.0",
        description: "Perfectly designed and precisely prepared electronic channelling system.",
    },

    company : {
        name: "iNAC",
        phone: "(071) 2660899",
        no: "456/140",
        street: "jabeer rd",
        cirty: "colombo",
        email: "hello.inac@gmail.com",
        copyright: "2019-2020",
    }
}

//init headless printing service
printFromUrl("init.odt",pdata,null,false);

var data = {
    firstname: 'John',
    lastname: 'Doe',
    cars : [
        {"brand" : "Lumeneo"},
        {"brand" : "Tesla"  },
        {"brand" : "Toyota" },
        {"brand" : "Lumeneo"},
        {"brand" : "Tesla"  },
        {"brand" : "Toyota" },
        {"brand" : "Lumeneo"},
        {"brand" : "Tesla"  },
        {"brand" : "Toyota" }
    ]
};

app.get('/testPrint', function (req, res) {

    printFromUrl('simple.odt',data,res);

});

app.post('/printDoctorInvoice', function (req, res) {
    var d =new Date().toLocaleTimeString().replace(/T/, ' ').replace(/\..+/, '');
    var d2 =new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    var tot= req.body.doctorInvoice_r.doc_fee *  req.body.doctorInvoice_r.patient_count;
    var grn = {
        grn_id: req.body.doctorInvoice_r.iddoctor_invoice,
        inv_date: d2+" "+d,
        doctor_name: req.body.doctor_r.name, 
        pcount: req.body.doctorInvoice_r.patient_count,
        appointment_date: req.body.doctorInvoice_r.cal,
        fee: req.body.doctorInvoice_r.doc_fee,
        username: req.body.user.name,
        total:tot
    };
    printFromUrl('doctor_invoice.odt', grn, res,true);
});


app.post('/printInvoice', function (req, res) {
    var d =new Date().toLocaleTimeString().replace(/T/, ' ').replace(/\..+/, '');
    var d2 =new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    var inv = {
        invoice_id: req.body.paient.invoice_id,
        inv_date: d2+" "+d,
        doctor_name: req.body.doctor.name, 
        appointment: req.body.number,
        appointment_date: req.body.doctor.datee,
        patient_name: req.body.paient.name,
        username: req.body.user.name,
        fee:req.body.doctor.fee

    };
    printFromUrl('patient_invoice.odt', inv, res,true);
});

app.post('/printReport', function (req, res) {
    
    if (req.body.transactionsRequest_r.expenses == true && req.body.transactionsRequest_r.income == true) {
        var d =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var report = {
            title_r: "Income & Expences",
            from: req.body.transactionsRequest_r.from_datee,
            to: req.body.transactionsRequest_r.to_datee,
            datarow: [
                { "date": req.body.transactions_r.date },
                { "issued_to": req.body.transactions_r.name },
                { "code": "INV" + req.body.transactions_r.code },
                { "status": req.body.transactions_r.status },
                { "income": req.body.transactions_r.income },
                { "expenses": req.body.transactions_r.expense },
                { "balance": req.body.transactions_r.balance }
            ]
        };
        printFromUrl('income_outcome.odt', report, res,false);
    } else if (req.body.transactionsRequest_r.expenses == true && req.body.transactionsRequest_r.income == false) {
        var d = new Date();
        var report = {
            title_r: "Expences",
            from: req.body.transactionsRequest_r.from_datee,
            to: req.body.transactionsRequest_r.to_datee,
            datarow: [
                { "date": req.body.transactions_r.date },
                { "issued_to": req.body.transactions_r.name },
                { "code": "INV" + req.body.transactions_r.code },
                { "status": req.body.transactions_r.status },
                { "expenses": req.body.transactions_r.expense },
                { "balance": req.body.transactions_r.balance }
            ]

        };
        printFromUrl('outcome.odt', report, res,false);
    } else {
        var d = new Date();
        var report = {
            title_r: "Income",
            from: req.body.transactionsRequest_r.from_datee,
            to: req.body.transactionsRequest_r.to_datee,
            datarow: [
                { "date": req.body.transactions_r.date },
                { "issued_to": req.body.transactions_r.name },
                { "code": "INV" + req.body.transactions_r.code },
                { "status": req.body.transactions_r.status },
                { "income": req.body.transactions_r.income },
                { "balance": req.body.transactions_r.balance }
            ]

        };
        printFromUrl('income.odt', report, res,false);
    }



});


app.post('/printPatient_report', function (req, res) {
    var d =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    // var d = new Date();
    var report = {
        doctor_name: req.body.doctor_r.name,
        date: req.body.schedule_r_daterange,
        datarow: [
            { "number": req.body.patient_r.number },
            { "p_name": req.body.patient_r.name },
            { "phone": req.body.patient_r.contactNo }
        ]

    };
    printFromUrl('appointments.odt', report, res,false);

});
