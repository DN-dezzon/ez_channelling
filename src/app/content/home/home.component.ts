import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HomeService } from './home.servie';
import { Observable } from 'rxjs';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

declare let swal: any;
declare let toastr: any;
declare var $: any;
declare var jquery: any;
@Component({

  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],

})
export class HomeComponent implements OnInit {
  elementRef: ElementRef;
  datatable: any;
  doctors: any[];
  doctor_appointments: any[];
  todaySchedule: any[];
  OptionsSelect: -1;
  patients: any[];
  patient_data: any[];
  doctor_data: any[];


  fullCalendar: any;
  doctorSchedules: any[];


  doctor = {
    doctor_iddoctor: "",
    iddoctor_schedule: "",
    iddoctor: "",
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
    datee: "",
    timee: "",
    tablelength: "",
    totalAppointment: "",
    todayPatientVisits: 0,
  };

  patient = {
    idpatient: -1,
    name: "",
    contactNo: "",
    amount: "",
    monthly_income: "",
    newpatient: ""
  };

  schedule = {
    iddoctor_schedule: -1,
    doctor: this.doctor,
    datee: "",//2012-12-30-----01/01/2015 - 01/31/2015
    doctor_in: "00:00:00",//23:11:22
    doctor_out: "00:00:00",
    repetive: "false",
    y: "",
    m: "",
    d: "",
    daterange: "",
  }

  appointment = {
    doctor: this.doctor,
    idappointment: -1,
    number: 0,
    payment_status: "Not Paid",
    iddoctor_schedule: -1,
    doctor_schedule: this.schedule,
    paient: this.patient,
    patient_idpatient: -1,
    issued_datetime: "",
  };

  myDate = new Date();
  constructor(private homeService: HomeService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    $('#printInvoice').hide();
    $('#channeling_date').datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: true,
      autoclose: true
    });

    this.getDoctors();
    this.getPatients();
    this.initCalendar();
  }


  print() {
    var data = document.getElementById('invoicee');

    //document.getElementById('invcont').style.display = "block";

    document.getElementById('invoice').className = "";

    html2canvas(data).then(canvas => {

      let pdf = new jspdf('l', 'mm','A5'); // A4 size page of PDF  
      
      const contentDataURL = canvas.toDataURL('image/png')
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, 74, 160);
      pdf.save("screen-3.pdf");
      // Few necessary setting options  
      // var imgWidth = pdf.internal.pageSize.getHeight();
      var imgWidth = 88;
      //var imgWidth = canvas.width;

      var imgHeight = canvas.height * imgWidth / canvas.width;
      //var imgHeight = canvas.height;   


     

      var Pagelink = "about:blank";
      var pwa = window.open(Pagelink, "_new");
      pwa.document.open();
      pwa.document.write(this.ImagetoPrint(contentDataURL));
      pwa.document.close();
      //     pdf.addImage(contentDataURL, 'PNG', 20, 0, imgWidth, imgHeight)  

      // pdf.autoPrint({variant: 'non-conform'});
      // pdf.save('autoprint.pdf');
      //document.getElementById('invcont').style.display = "none";
      document.getElementById('invoice').className = "modal fade";
    });
  }


  ImagetoPrint(source) {
    return "<html><head><style>" +
      "@page { size: auto;  margin: 0mm; }" +
      "</style><scri" + "pt>function step1(){\n" +
      "setTimeout('step2()', 200);}\n" +
      "function step2(){window.print();window.close()}\n" +
      "</scri" + "pt></head><body onload='step1()' style='text-align: center; display: block;'>\n" +
      "<img src='" + source + "' /></body></html>";
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
          $('#homeScheduleSelected').val(schedule.index - 1);
          $('#homeScheduleSelected').click();
          return false;
        }
      });

      var bttn = document.getElementById("homeScheduleSelected");

      bttn.onclick = () => {
        this.scheduleSelected($('#homeScheduleSelected').val());
       
        var res = this.schedule.datee.split("T"); 
        this.doctor.datee= res[0] ;
        this.getAppointmentNumber(this.doctor);
        this.getScheduleId(this.doctor);
      }
    }
  }

  scheduleSelected(index) {
    this.schedule.d = this.doctorSchedules[index].d;
    this.schedule.datee = this.doctorSchedules[index].datee;
    this.schedule.doctor_in = this.doctorSchedules[index].doctor_in;
    this.schedule.doctor_out = this.doctorSchedules[index].doctor_out;
    this.schedule.iddoctor_schedule = this.doctorSchedules[index].iddoctor_schedule;
    this.schedule.m = this.doctorSchedules[index].m;
    this.schedule.y = this.doctorSchedules[index].y;

  }

  getSchedules() {
    this.doctorSchedules = [];
    if (this.fullCalendar) {
      this.fullCalendar.fullCalendar('getCalendar').removeEvents();
    }
    this.homeService.getAllDoctorScheduleByDoctor(this.doctor).subscribe((data: any) => {
      this.doctorSchedules = data;
      this.addIndex(this.doctorSchedules);
      if (this.fullCalendar) {
        this.fullCalendar.fullCalendar('getCalendar').removeEvents();
        this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.doctorSchedules);
      }
    }, (err) => {
      toastr.error('While fetching schedules', 'Data fetch error');
    }
    );
  }


  clearSchedule() {
    this.schedule.iddoctor_schedule = -1;
    this.schedule.datee = "";
    this.schedule.doctor_in = "00:00:00";
    this.schedule.doctor_out = "00:00:00";
    this.schedule.y = "";
    this.schedule.m = "";
    this.schedule.d = "";
    this.schedule.daterange = "";
  }

  searchPatientName(value) {
    // this.patient.idpatient = value;
    this.getPatientById(this.patient.idpatient);
  }

  searchDoctorFee(value) {
    this.doctor.iddoctor = value;
    this.getDoctorById(this.doctor);
    this.getSchedules();
    this.clearSchedule();
  }

  searchAppointment(value) {
    
    this.getAppointmentNumber(this.doctor);
    this.getScheduleId(this.doctor);
  }

  activatePrint(value) {

  }

  getDoctors() {
    this.homeService.getDoctors().subscribe((data: any) => {
      this.doctors = data;

    }, (err) => {
      console.log(err);
    }
    );
  }
  // Load ptient to dropdown
  getPatients() {
    this.homeService.getPatients().subscribe((data: any) => {

      this.patients = data;
    }, (err) => {
      console.log(err);
    }
    );
  }
  // Load ptient to dropdown
  getPatientById(patient: any) {
    this.homeService.getPatientById(patient).subscribe((data: any) => {

      this.patient_data = data;
      for (let index = 0; index < this.patient_data.length; index++) {
        console.log(this.patient_data[index].name);
        this.patient.name = this.patient_data[index].name;
        this.patient.idpatient = this.patient_data[index].idpatient;
        this.patient_data[index].index = index + 1;
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

  // Load doctor to dropdown
  getDoctorById(did: any) {
    this.homeService.getDoctorById(did).subscribe((data: any) => {
      this.doctor_data = data;
      for (let index = 0; index < this.doctor_data.length; index++) {
        this.doctor.fee = this.doctor_data[index].fee;
        this.doctor.iddoctor = this.doctor_data[index].iddoctor;
        this.doctor.name = this.doctor_data[index].name;
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

  getAppointmentNumber(doctor: any) {
    alert("sdasd");
    console.log(this.doctor);
    alert(this.doctor.iddoctor)
    this.homeService.getAppointMentNumber(doctor).subscribe((data: any) => {
      this.doctor_appointments = data;
      for (let index = 0; index < this.doctor_appointments.length; index++) {
        this.appointment.number = this.doctor_appointments[index].count + 1;
        

      }


    }, (err) => {
      console.log(err);
    });
  }

  getScheduleId(doctor: any) {
    this.homeService.getScheduleIdId(doctor).subscribe((data: any) => {
      this.doctor_appointments = data;
      for (let index = 0; index < this.doctor_appointments.length; index++) {
        this.doctor.iddoctor_schedule = this.doctor_appointments[index].iddoctor_schedule;
        
      }
    }, (err) => {
      console.log(err);
    });
  }

  selectPatientMobileNo(mobileNo) {
    this.patient.contactNo = mobileNo;
    this.homeService.getPatientByContactNo(this.patient).subscribe((data: any) => {

      this.patient_data = data;
      for (let index = 0; index < this.patient_data.length; index++) {
        console.log(this.patient_data[index].name);
        this.patient.name = this.patient_data[index].name;
        this.patient.idpatient = this.patient_data[index].idpatient;
      }
    }, (err) => {
      console.log(err);
    }
    );
    this.patient.contactNo = mobileNo;
    this.patient.newpatient = "no";
    console.log(mobileNo);
  }

  selectNewPatientMobileNo(mobileNo) {
    this.patient.contactNo = mobileNo;
    this.patient.newpatient = "yes";
    console.log(mobileNo);
  }

  createDropDown() {

    var _this = this;

    $.widget("custom.combobox", {
      _create: function () {
        this.wrapper = $("<span>")
          // .addClass( "custom-combobox" )
          .insertAfter(this.element);

        this.element.hide();
        this._createAutocomplete();
      },

      _createAutocomplete: function () {
        var selected = this.element.children(":selected"),
          value = selected.val() ? selected.text() : "";

        this.input = $("<input >")
          .appendTo(this.wrapper)
          .val(value)
          .attr("title", "")
          .addClass("form-control m-b")
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy(this, "_source")
          })
          .tooltip({
            classes: {
              "ui-tooltip": "ui-state-highlight"
            }
          });

        this._on(this.input, {
          autocompleteselect: function (event, ui) {
            ui.item.option.selected = true;
            this._trigger("select", event, {
              item: ui.item.option
            });
          },

          autocompletechange: "_removeIfInvalid"
        });
      },


      _source: function (request, response) {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
        response(this.element.children("option").map(function () {
          var text = $(this).text();
          if (this.value && (!request.term || matcher.test(text)))
            return {
              label: text,
              value: text,
              option: this
            };
        }));
      },

      _removeIfInvalid: function (event, ui) {

        // Selected an item, nothing to do
        if (ui.item) {
          _this.selectPatientMobileNo(this.input.val().trim());
          return;
        }

        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children("option").each(function () {
          if ($(this).text().toLowerCase() === valueLowerCase) {
            this.selected = valid = true;
            return false;
          }
        });

        // Found a match, nothing to do
        if (valid) {
          return;
        }

        // Remove invalid value
        this.input
          //.val("")
          .attr("title", value + " is a new Patient")
          .tooltip("open");
        //this.element.val("");
        _this.selectNewPatientMobileNo(value.trim());
        this._delay(function () {
          this.input.tooltip("close").attr("title", "");
        }, 2500);
        //this.input.autocomplete("instance").term = "";
      },

      _destroy: function () {
        this.wrapper.remove();
        this.element.show();
      }
    });

    $("#combobox").combobox();
    $("#toggle").on("click", function () {
      $("#combobox").toggle();
    });

  }
  ngAfterViewInit() {
    this.createDropDown();
    this.loadTodaySchedule();
    this.getTodayPatientIncome();
    this.getTodayPatientMonthlyIncome();
  }

  clearForm(){
     this.getDoctors();
    this.getPatients();
    this.initCalendar();
    this.createDropDown();
    this.appointment.number=0;
    this.doctor.fee=0;
    this.patient.name="";
  }
  makeAppointment() {
    this.homeService.saveAppointment(this.appointment).subscribe((data: any) => {
      if (this.appointment.payment_status == "Paid") {
        $('#printInvoice').click();
      } else {
      }
      toastr.info("Appointment made successfully!");
      this.clearForm();
    }, (err) => {
      console.log(err);

      toastr.error("Please try again!");
    }
    );
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index + 1;
    }
  }
  loadTodaySchedule() {

    this.doctor.datee = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');

    this.homeService.getTodaySchedule(this.doctor).subscribe((data: any) => {
      this.todaySchedule = data;
      this.doctor.tablelength = data.length;
      for (let index = 0; index < this.todaySchedule.length; index++) {
        this.doctor.iddoctor = this.todaySchedule[index].iddoctor;
        this.homeService.getAppointMentNumber(this.doctor).subscribe((data: any) => {
          this.doctor_appointments = data;
          this.doctor.totalAppointment = "";
          this.doctor.iddoctor_schedule = this.doctor_appointments[index].iddoctor_schedule;
          for (let index = 0; index < this.doctor_appointments.length; index++) {

            this.doctor.totalAppointment = this.doctor_appointments[index].count;
            this.doctor.todayPatientVisits = Number(this.doctor.todayPatientVisits) + Number(this.doctor_appointments[index].count);

          }
          this.todaySchedule[index].totalAppointment = this.doctor.totalAppointment;
          // console.log( this.doctor.todayPatientVisits);
        }, (err) => {
          console.log(err);
        })

        this.todaySchedule[index].index = index + 1;
      }

      // this.resetTableListners();
    }, (err) => {
      console.log(err);
    }
    );
  }

  getTodayPatientIncome() {
    this.homeService.getPatientIncome().subscribe((data: any) => {
      this.patient_data = data;

      for (let index = 0; index < this.patient_data.length; index++) {
        console.log(this.patient_data[index].amount);
        this.patient.amount = this.patient_data[index].sum;
        console.log(this.patient.amount)
      }

    }, (err) => {
      console.log(err);
    });
  }

  getTodayPatientMonthlyIncome() {
    this.homeService.getPatientIncomeMonthly().subscribe((data: any) => {
      this.patient_data = data;

      for (let index = 0; index < this.patient_data.length; index++) {
        console.log(this.patient_data[index].amount);
        this.patient.monthly_income = this.patient_data[index].monthlytot;
      }

    }, (err) => {
      console.log(err);
    });
  }
}
