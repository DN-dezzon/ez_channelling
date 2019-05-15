import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})

export class DoctorComponent implements OnInit {
  datatable: any;
  fullCalendar: any;
  doctors: any[];
  events: any[];
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
    repetive: "true",
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
    (<any>$("#newDoctor")).modal();
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
    this.doctorService.getDoctors().subscribe((data: any) => {
      this.doctors = data;
      this.addIndex(this.doctors);
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      console.log(err);
    }
    );
  }

  getNextDoctorId() {
    this.doctorService.getNextDoctorId().subscribe((data: any) => {
      this.doctor.iddoctor = data.iddoctor;
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
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.deleteDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  showUpdateModal(doctor: any) {
    this.mode = 'update';
    this.doctor = doctor;
    (<any>$("#newDoctor")).modal();
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
        events: this.events,
        eventClick: function (info) {
          console.log(info);
        }
      });
    }
  }

  clickNewSchedule() {
    this.mode = 'newSchedule';
    (<any>$("#newSchedule")).modal();
  }

  showUpdateScheduleModal(schedule: any) {

  }

  addEvents() {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    this.events = [
      {
        title: 'All Day Event',
        start: new Date(y, m, 1)
      },
      {
        title: 'Long Event',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2)
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: false
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: false
      },
      {
        title: 'Meeting',
        start: new Date(y, m, d, 10, 30),
        allDay: false
      },
      {
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false
      },
      {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false
      },
      {
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://google.com/'
      }
    ];
    this.fullCalendar.fullCalendar('getCalendar').removeEvents();
    this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.events);
  }

  saveSchedule() {
    if (this.schedule.repetive == 'true') {
      this.schedule.datee = (<HTMLInputElement>document.getElementById("selectDateRangeDoctor")).value;
    } else {
      this.schedule.datee = (<HTMLInputElement>document.getElementById("selectDateDoctor")).value;
    }

    console.log(this.schedule);
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
      autoclose: true,
      onSelect: function (date) {
        alert(date);
      }
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
