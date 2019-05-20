import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from './doctor.service';

declare let swal: any;
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  datatable: any;
  fullCalendar: any;
  doctors: any[];
  doctorSchedules: any[];
  schedulePatients: any[];

  mode = "";

  doctor = {
    iddoctor: -1,
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
  };

  schedule = {
    iddoctor_schedule: -1,
    doctor: this.doctor,
    datee: "",//2012-12-30-----01/01/2015 - 01/31/2015
    doctor_in: "00:00:00",//23:11:22
    doctor_out: "00:00:00",
    repetive: "false",
    in_h: "8",
    in_m: "0",
    in_d: "AM",
    out_h: "10",
    out_m: "0",
    out_d: "AM",
    daterange: "",
  }

  constructor(private doctorService: DoctorService) { }


  ngOnInit() {
    this.getDoctors();
  }

  ngAfterViewInit() {
    this.initTable();
    this.initSelect();
    this.initDatepickers();
  }

  clickNew() {
    this.mode = 'new';
    this.clearDoctor();
    this.getNextDoctorId();
  }

  clearDoctor() {
    this.doctor.iddoctor = -1;
    this.doctor.name = "";
    this.doctor.specialization = "";
    this.doctor.base_hospital = "";
    this.doctor.contactNo = "";
    this.doctor.fee = 0.0;
    this.doctor.description = "";
  }

  getDoctors() {
    this.doctors = [];
    this.doctorService.getDoctors().subscribe((data: any) => {
      this.doctors = data;
      this.addIndex(this.doctors);
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      console.log(err);
    }
    );
  }

  datesTabSelected() {
    this.clearDoctor();
    this.clearSchedule();
    setTimeout(this.initCalendar, 10);
  }

  getNextDoctorId() {
    this.doctorService.getNextDoctorId().subscribe((data: any) => {
      this.doctor.iddoctor = data.iddoctor;
      (<any>$("#newDoctor")).modal();
    }, (err) => {
      console.log(err);
    }
    );
  }

  getNextDoctorScheduleId() {
    this.doctorService.getNextDoctorScheduleId().subscribe((data: any) => {
      this.schedule.iddoctor_schedule = data.iddoctor_schedule;
      (<any>$("#newSchedule")).modal();
    }, (err) => {
      console.log(err);
    }
    );
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index + 1;
    }
  }

  saveDoctor() {
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.saveDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  updateDoctor() {
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.updateDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  deleteDoctor() {
    let _this = this;
    swal({
      title: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    },
      function (isConfirm) {
        if (isConfirm) {
          _this.doctorService.deleteDoctor(_this.doctor).subscribe((data: any) => {
            _this.getDoctors();
            (<any>$("#newDoctor")).modal("hide");
          }, (err) => {
            console.log(err);
          }
          );
        } else {
          (<any>$("#newDoctor")).modal("hide");
        }
      });
  }

  showUpdateModal(doctor: any) {
    this.mode = 'update';
    this.doctor.iddoctor = doctor.iddoctor;
    this.doctor.name = doctor.name;
    this.doctor.specialization = doctor.specialization;
    this.doctor.base_hospital = doctor.base_hospital;
    this.doctor.contactNo = doctor.contactNo;
    this.doctor.fee = doctor.fee;
    this.doctor.description = doctor.description;
    (<any>$("#newDoctor")).modal();
  }

  get12Pm(t24) {
    let ret = "AM";
    let t = t24.split(":");
    if (parseInt(t[0], 10) > 12) {
      ret = "PM";
    }
    return ret;
  }

  get12Hour(t24) {
    let t = t24.split(":");
    if (parseInt(t[0], 10) > 12) {
      t[0] = parseInt(t[0], 10) - 12;
    }
    if (t[0] == 0) {
      t[0] = 12;
    }
    return t[0];
  }

  get12Munite(t24) {
    return t24.split(":")[1];
  }

  scheduleSelected(index) {
    this.clearSchedule();
    this.schedule.iddoctor_schedule = this.doctorSchedules[index].iddoctor_schedule;
    this.schedule.datee = this.doctorSchedules[index].datee;
    this.schedule.doctor_in = this.doctorSchedules[index].doctor_in;
    this.schedule.doctor_out = this.doctorSchedules[index].doctor_out;
    this.schedule.in_h = this.get12Hour(this.schedule.doctor_in);
    this.schedule.in_m = this.get12Munite(this.schedule.doctor_in);
    this.schedule.in_d = this.get12Pm(this.schedule.doctor_in);
    this.schedule.out_h = this.get12Hour(this.schedule.doctor_out);
    this.schedule.out_m = this.get12Munite(this.schedule.doctor_out);
    this.schedule.out_d = this.get12Pm(this.schedule.doctor_out);
    let d = new Date(this.doctorSchedules[index].start);
    this.schedule.daterange = this.doctorSchedules[index].m + "/" + this.doctorSchedules[index].d + "/" + this.doctorSchedules[index].y;
    this.getSchedulePatients();
  }


  getSchedulePatients(){
    this.schedulePatients = [];
    this.doctorService.getPatientsBySchedule(this.schedule).subscribe((data: any) => {
      this.schedulePatients = data;
      console.log(data);
    }, (err) => {
      console.log(err);
    }
    );
  }

  initCalendar() {
    if (!this.fullCalendar) {
      this.fullCalendar = (<any>$('#calendar')).fullCalendar({
        defaultView: 'month',
        height: "auto",
        header: {
          left: '',
          center: 'title',
          right: 'prev,next today'
        },
        editable: false,
        events: this.doctorSchedules,
        eventClick: (schedule) => {
          $('#globalScheduleSelected').val(schedule.index - 1);
          $('#globalScheduleSelected').click();
          return false;
        }
      });

      var bttn = document.getElementById("globalScheduleSelected");

      bttn.onclick = () => {
        this.scheduleSelected($('#globalScheduleSelected').val());
      }
    }
  }

  clickNewSchedule() {
    this.mode = 'newSchedule';
    this.clearSchedule();
    this.getNextDoctorScheduleId();
  }

  timeConvertor(h, m, d) {
    if (d == "PM") {
      h = parseInt(h, 10) + 12;
      if (h == 24) {
        h = 0;
      }
    }
    return h + ":" + m + ":0";
  }

  inTimeSelected(h, m, d) {
    this.schedule.in_h = h;
    this.schedule.in_m = m;
    this.schedule.in_d = d;
  }

  outTimeSelected(h, m, d) {
    this.schedule.out_h = h;
    this.schedule.out_m = m;
    this.schedule.out_d = d;
  }

  clearSchedule() {
    this.schedule.iddoctor_schedule = -1;
    this.schedule.datee = "";//2012-12-30-----01/01/2015 - 01/31/2015
    this.schedule.doctor_in = "00:00:00";//23:11:22
    this.schedule.doctor_out = "00:00:00";
    this.schedule.repetive = "false";
    this.schedule.in_h = "8";
    this.schedule.in_m = "0";
    this.schedule.in_d = "AM";
    this.schedule.out_h = "10";
    this.schedule.out_m = "0";
    this.schedule.out_d = "AM";
    this.schedule.daterange = "";
  }

  showUpdateScheduleModal(schedule: any) {
    this.mode = 'editSchedule';
    (<any>$("#newSchedule")).modal();
  }

  updateSchedule() {
    if (this.schedule.repetive == 'true') {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeDoctor")).value;
    } else {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateDoctor")).value;
    }
    if (!this.schedule.daterange && this.schedule.repetive == 'true') {
      swal({
        title: "Please select a date range",
        confirmButtonColor: '#FF8800'
      });
    } else if (!this.schedule.daterange && this.schedule.repetive == 'false') {
      swal({
        title: "Please select a date",
        confirmButtonColor: '#FF8800'
      });
    } else {
      let datee = this.schedule.daterange.split("/");
      if (datee.length != 3) {
        swal({
          title: "Date invalid",
          confirmButtonColor: '#FF8800'
        });
      } else {
        this.schedule.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

        this.schedule.doctor_out = this.timeConvertor(this.schedule.out_h, this.schedule.out_m, this.schedule.out_d);
        this.schedule.doctor_in = this.timeConvertor(this.schedule.in_h, this.schedule.in_m, this.schedule.in_d);
        this.doctorService.updateDoctorSchedule(this.schedule).subscribe((data: any) => {
          (<any>$("#newSchedule")).modal('hide');
          this.getSchedules();
          this.clearSchedule();
        }, (err) => {
          swal({
            title: "Error",
            confirmButtonColor: '#DD6B55'
          });
        }
        );
      }
    }
  }

  deleteSchedule() {
    let _this = this;
    swal({
      title: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    },
      function (isConfirm) {
        if (isConfirm) {
          _this.doctorService.deleteDoctorSchedule(_this.schedule).subscribe((data: any) => {
            (<any>$("#newSchedule")).modal('hide');
            _this.getSchedules();
            _this.clearSchedule();
          }, (err) => {
            swal({
              title: "Error",
              confirmButtonColor: '#DD6B55'
            });
          }
          );
        } else {
          (<any>$("#newSchedule")).modal('hide');
        }
      });
  }

  getSchedules() {
    this.doctorSchedules = [];
    if (this.fullCalendar) {
      this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.doctorSchedules);
    }
    this.doctorService.getAllDoctorScheduleByDoctor(this.doctor).subscribe((data: any) => {
      this.doctorSchedules = data;
      this.addIndex(this.doctorSchedules);
      if (this.fullCalendar) {
        this.fullCalendar.fullCalendar('getCalendar').removeEvents();
        this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.doctorSchedules);
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

  saveSchedule() {
    if (this.schedule.repetive == 'true') {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeDoctor")).value;
    } else {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateDoctor")).value;
    }
    if (!this.schedule.daterange && this.schedule.repetive == 'true') {
      swal({
        title: "Please select a date range",
        confirmButtonColor: '#FF8800'
      });
    } else if (!this.schedule.daterange && this.schedule.repetive == 'false') {
      swal({
        title: "Please select a date",
        confirmButtonColor: '#FF8800'
      });
    } else {
      let datee = this.schedule.daterange.split("/");
      console.log(datee.length);
      if (datee.length != 3) {
        swal({
          title: "Date invalid",
          confirmButtonColor: '#FF8800'
        });
      } else {
        this.schedule.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

        this.schedule.doctor_out = this.timeConvertor(this.schedule.out_h, this.schedule.out_m, this.schedule.out_d);
        this.schedule.doctor_in = this.timeConvertor(this.schedule.in_h, this.schedule.in_m, this.schedule.in_d);
        this.doctorService.saveDoctorSchedule(this.schedule).subscribe((data: any) => {
          (<any>$("#newSchedule")).modal('hide');
          this.getSchedules();
          this.clearSchedule();
        }, (err) => {
          swal({
            title: "Error",
            confirmButtonColor: '#DD6B55'
          });
        }
        );
      }
    }
  }

  initSelect() {
    var _this = this;

    (<any>$(".select2_demo_3")).select2({
      dropdownCssClass: 'custom-dropdown'
    });

    (<any>$(".select2_demo_3")).on('select2:open', function (e) {
      $('.custom-dropdown').parent().css('z-index', 99999);
    });

    (<any>$(".select2_demo_3")).on('select2:select', function (e) {
      _this.docSelected(e.params.data.id);
    });
  }

  docSelected(index) {
    if (index == "") {
      this.clearDoctor();
    } else {
      this.doctor.iddoctor = this.doctors[index].iddoctor;
      this.doctor.name = this.doctors[index].name;
      this.doctor.specialization = this.doctors[index].specialization;
      this.doctor.base_hospital = this.doctors[index].base_hospital;
      this.doctor.contactNo = this.doctors[index].contactNo;
      this.doctor.fee = this.doctors[index].fee;
      this.doctor.description = this.doctors[index].description;
    }

    this.initCalendar();
    this.getSchedules();
    //setTimeout(this.initCalendar, 10);

  }

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
      responsive: true,
      columns: [
        {
          data: "index"
        },
        {
          data: "iddoctor"
        },
        {
          data: "name"
        },
        {
          data: "specialization"
        },
        {
          data: "base_hospital"
        },
        {
          data: "contactNo"
        },
        {
          data: "fee"
        },
        {
          data: "description"
        },
        //create three buttons columns
        {
          defaultContent: `<button type="button" class="btn btn-xs btn-warning showUpdateModal"><span class="glyphicon glyphicon-edit"></span>
          </button>`
        }
      ],
      "columnDefs": [
        {
          "searchable": false,
          sortable: false,
          "class": "index",
          "targets": [0]
        },
        {
          "searchable": false,
          "orderable": false,
          "targets": [4]
        }],
      "order": [[1, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });


  }

  initDatepickers() {
    (<any>$('#selectDateDoctor')).datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: true,
      autoclose: true
    });
    (<any>$('#selectDateRangeDoctor')).daterangepicker();
  }


  resetTableListners() {

    //store current class reference in _currClassRef variable for using in jquery click event handler
    var _currClassRef = this;

    //unbind previous event on tbody so that multiple events are not binded to the table whenever this function runs again
    $('#editable tbody td').unbind();

    //defined jquery click event
    $('#editable tbody td').on('click', 'button', function () {
      //the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      //get row for data
      var tr = $(this).closest('tr');
      var row = _currClassRef.datatable.row(tr);
      //this of jquery object
      if ($(this).hasClass("showFButton")) {
        //use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);
      }
      else if ($(this).hasClass("showLButton")) {
        //_currClassRef.showValue(row.data().LastName);
      }
      else if ($(this).hasClass("showUpdateModal")) {
        _currClassRef.showUpdateModal(row.data());
      }

    })
  }


}
