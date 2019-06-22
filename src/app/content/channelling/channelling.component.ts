import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChannellingServie } from './channelling.servie';
import { Observable } from 'rxjs';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatabaseService } from 'src/app/database.service';
import { company, product, medicalCenter } from 'src/environments/environment.prod';

declare let swal: any;
declare let toastr: any;
declare var $: any;
declare var jquery: any;
@Component({

  selector: 'channelling',
  templateUrl: './channelling.component.html',
  styleUrls: ['./channelling.component.scss'],
  providers: [DatePipe],

})
export class ChannellingComponent implements OnInit {
  elementRef: ElementRef;
  datatable: any;
  doctors: any[];
  doctor_appointments: any[];
  doctor_appointments2: any[];
  todaySchedule: any[];
  OptionsSelect: -1;
  patients: any[];
  patient_data: any[];
  doctor_data: any[];

  medicalCenter: any;
  fullCalendar: any;
  doctorSchedules: any[];

  user = {
    name: "test"
  }

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
    newpatient: "",
    invoice_id: 0
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
    hideAppointment: true,
    doctor: this.doctor,
    idappointment: -1,
    number: 0,
    payment_status: "Not Paid",
    iddoctor_schedule: -1,
    doctor_schedule: this.schedule,
    paient: this.patient,
    patient_idpatient: -1,
    issued_datetime: "",
    today: new Date(),
    pay_now: "no",
    patient_intime: "00:00"
  };

  appointmentdata = {
    idpatient: -1,
    iddoctor_schedule: ""
  };

  myDate = new Date();
  constructor(private channellingService: ChannellingServie, private datePipe: DatePipe, private databaseService: DatabaseService) {
    this.medicalCenter = medicalCenter;
  }

  ngOnInit() {
    this.user.name = this.databaseService.user.name;
    this.appointment.today = new Date();
    this.appointment.hideAppointment = true;
    // $('#printInvoice').hide(); 
    $('#pname_new').hide();
    $('#channeling_date').datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: true,
      autoclose: true
    });
    this.initSelect();
    this.getDoctors();
    this.getPatients();
    this.initCalendar();


  }


  print() {
    var data = document.getElementById('invoicee');

    //document.getElementById('invcont').style.display = "block";

    document.getElementById('invoice').className = "";

    html2canvas(data).then(canvas => {

      let pdf = new jspdf('l', 'mm', 'A5'); // A4 size page of PDF  
      var imgWidth = 88;

      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, imgWidth, imgHeight);
      // pdf.save("screen-3.pdf");
      pdf.autoPrint();
      var Pagelink = "about:blank";
      // var pwa = window.open(Pagelink, "_new");
      // pwa.document.open();
      // pwa.document.write(this.ImagetoPrint(contentDataURL));
      // pwa.document.close(); 
      $('#invoice').show();
      document.getElementById('invoice').className = "modal fade";
    });
  }

  printPatirntInvoice() {
    this.print();
  }
  ImagetoPrint(source) {
    return "<html><head><style>" +
      "@page { size: auto;  margin: 0mm; }" +
      "</style><scri" + "pt>function step1(){\n" +
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

  initSelect() {
    var _this = this;

    (<any>$(".select2_demo_3")).select2({
      dropdownCssClass: 'custom-dropdown'
    });

    (<any>$(".select2_demo_3")).on('select2:open', function (e) {
      $('.custom-dropdown').parent().css('z-index', 99999);
    });

    (<any>$(".select2_demo_3")).on('select2:select', function (e) {

      _this.searchDoctorFee(e.params.data.id);
    });
  }


  initCalendar() {
    if (!this.fullCalendar) {
      this.fullCalendar = (<any>$('#calendar')).fullCalendar({
        timezone : 'local',
        displayEventTime : false,
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
        this.doctor.datee = res[0];
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
    this.channellingService.getAllDoctorScheduleByDoctor(this.doctor).subscribe((data: any) => {
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
    alert(value);
    // this.patient.idpatient = value; 
    this.patient.contactNo = value;
    this.channellingService.getPatientbyMobile(this.patient).subscribe((data: any) => {
      alert(data);
      if (data.length > 0) {
        this.patient_data = data;
        for (let index = 0; index < this.patient_data.length; index++) {
          this.patient.name = this.patient_data[index].name;
          this.patient.idpatient = this.patient_data[index].idpatient;
          this.patient_data[index].index = index + 1;
        }
      } else {
        $('#pname_new').show();
        $('#pname_old').hide();

        this.getAppointmentNumber(this.doctor);
        this.appointment.payment_status = "Pending";
      }

    }, (err) => {
      console.log(err);
    }
    );

  }

  searchDoctorFee(value) {
    this.doctor.iddoctor = value;
    this.getDoctorById(this.doctor);
    this.getSchedules();
    this.clearSchedule();
  }

  searchAppointment(value) {

    this.patient.idpatient = value;
    this.appointmentdata.iddoctor_schedule = this.doctor.iddoctor_schedule;
    this.appointmentdata.idpatient = this.patient.idpatient;

    this.channellingService.searchAppointment(this.appointmentdata).subscribe((data: any) => {
      if (data.length > 0) {
        this.appointment.pay_now = "yes";
        $("#makeappointment").html('Make Payment');
        for (let index = 0; index < data.length; index++) {
          // $('#appno').css('border-color', 'red');
          // $('#apptime').css('border-color', 'red');
          $('#appno').css('border', '2px solid red');
          $('#apptime').css('border', '2px solid red');

          this.patient.name = data[index].name;
          this.appointment.payment_status = data[index].payment_status;
          this.appointment.idappointment = data[index].idappointment;
          console.log(data[index].number);
          this.appointment.patient_intime = data[index].patient_intime;
          console.log(data[index].number);
          this.appointment.number = data[index].number;
          if (data[index].payment_status == "Paid") {
            toastr.info("Payment already made!");
            $('#pstatus').prop('disabled', true);
            this.appointment.hideAppointment = true;
          } else {
            $('#pstatus').prop('disabled', false);
            this.appointment.hideAppointment = false;
          }
        }

      } else {
        $('#appno').css('border', '1px solid #e5e6e7');
        $('#apptime').css('border', '1px solid #e5e6e7');
        $('#pstatus').prop('disabled', false);
        $("#makeappointment").html('Make Appointment');
        this.appointment.pay_now = "no";
        this.getAppointmentNumber(this.doctor);
        this.appointment.payment_status = "Pending";
        // $('#makeappointment').show();
        // $('#makepayment').hide();
        this.appointment.hideAppointment = false;
      }
    }, (err) => {
      console.log(err);
    });
    // this.getAppointmentNumber(this.doctor);
    // this.getScheduleId(this.doctor);
  }

  activatePrint(value) {
    this.appointment.hideAppointment = false;
  }

  getDoctors() {
    this.channellingService.getDoctors().subscribe((data: any) => {
      this.doctors = data;

    }, (err) => {
      console.log(err);
    }
    );
  }
  // Load ptient to dropdown
  getPatients() {
    this.channellingService.getPatients().subscribe((data: any) => {

      this.patients = data;
    }, (err) => {
      console.log(err);
    }
    );
  }
  // Load ptient to dropdown
  getPatientById(patient: any) {
    this.channellingService.getPatientById(patient).subscribe((data: any) => {

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
    this.channellingService.getDoctorById(did).subscribe((data: any) => {
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
  addMinutes(time, minsToAdd) {
    function D(J) { return (J < 10 ? '0' : '') + J };

    var piece = time.split(':');

    var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
  }
  getAppointmentNumber(doctor: any) { 
    this.channellingService.getAppointMentNumber(doctor).subscribe((data: any) => {
      this.doctor_appointments = data;
      this.appointment.number = this.doctor_appointments[0].count+1; 
      this.channellingService.getTimePeroid(doctor).subscribe((data: any) => {
        this.doctor_appointments2 = data; 
        
        for (let index = 0; index < this.doctor_appointments2.length; index++) {
          let tot_minutes = this.doctor_appointments2[index].con_period * (this.appointment.number - 1);
          this.appointment.patient_intime = this.addMinutes(this.doctor_appointments2[index].doctor_in, tot_minutes);
        }
      }, (err) => {
        console.log(err);
      });
      //       }
    }, (err) => {
      console.log(err);
    });


  }


  getScheduleId(doctor: any) {
    this.channellingService.getScheduleIdId(doctor).subscribe((data: any) => {
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
    this.channellingService.getPatientByContactNo(this.patient).subscribe((data: any) => {

      if (data.length > 0) {

        this.patient_data = data;
        for (let index = 0; index < this.patient_data.length; index++) {
          console.log(this.patient_data[index].name);
          this.patient.name = this.patient_data[index].name;
          this.patient.idpatient = this.patient_data[index].idpatient;
          $('#pname_new').hide();
          $('#pname_old').show();
        }
      } else {

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
    this.patient.name = "";
    $('#pname_new').show();
    $('#pname_old').hide();
    $('#pstatus').prop('disabled', false);
    this.getAppointmentNumber(this.doctor);
    this.appointment.payment_status = "Pending";
    $('#appno').css('border', '1px solid #e5e6e7');
    $('#apptime').css('border', '1px solid #e5e6e7');
  }
  pnoo = "";
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
          .addClass("form-control m-b pnumber")
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

        }, 1000);

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
    $('.pnumber').keypress(function (event) {

      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        alert('You pressed a "enter" key in textbox' + this.pnoo);
      }
    });
  }
  ngAfterViewInit() {
    this.createDropDown();
    this.loadTodaySchedule();
    this.getTodayPatientIncome();
    this.getTodayPatientMonthlyIncome();
  }

  clearForm() {
    this.getDoctors();

    this.appointment.number = 0;
    this.doctor.fee = 0;
    this.patient.name = "";
    this.patient.contactNo = "";
    this.appointment.patient_intime = "00.00";
    this.doctor.iddoctor_schedule = "";
    this.appointment.payment_status == "Pending";

    //clear doctor
    $('#dname').val("0").trigger('change');

    //clear calender
    this.fullCalendar.fullCalendar('getCalendar').removeEvents();

    $(".pnumber").val("");
    $('#pname_old option:eq(0)').prop('selected', true)
    // $('#pname_old')
    // .empty()
    // .append('<option selected="selected"></option>'); 
    $('#appno').css('border', '1px solid #e5e6e7');
    $('#apptime').css('border', '1px solid #e5e6e7');
    ;
  }

  validateNull() {
    if (this.appointment.number == 0 || this.doctor.fee == 0 || $('.pnumber').val() == '' || $('#pname_old').val() == '0' || this.appointment.payment_status == '') {
      return true;
    } else {
      return false;
    }
  }
  makeAppointment() {
    if (this.validateNull() == true) {
      toastr.error("Please fill required data!");
    } else {
      if (this.appointment.pay_now == "yes") {
        this.channellingService.makePayment(this.appointment).subscribe((data: any) => {
          console.log(data);
          $('#printInvoice').click();
          this.patient.invoice_id = data[0];
          toastr.info("Payment made successfully!");

        }, (err) => {
          console.log(err);

          toastr.error("Please try again!");
        }
        );
      } else {
        this.channellingService.saveAppointment(this.appointment).subscribe((data: any) => {
          console.log(data);

          if (this.appointment.payment_status == "Paid") {
            this.patient.invoice_id = data;
            $('#printInvoice').click();
          }
          toastr.info("Appointment made successfully!");

        }, (err) => {
          console.log(err);
          toastr.error("Please try again!");
        }
        );
      }
    }


  }


  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index + 1;
    }
  }
  loadTodaySchedule() {

    this.doctor.datee = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');

    this.channellingService.getTodaySchedule(this.doctor).subscribe((data: any) => {
      this.todaySchedule = data;
      this.doctor.tablelength = data.length;
      for (let index = 0; index < this.todaySchedule.length; index++) {
        this.doctor.iddoctor = this.todaySchedule[index].iddoctor;
        this.channellingService.getAppointMentNumber(this.doctor).subscribe((data: any) => {
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
    this.channellingService.getPatientIncome().subscribe((data: any) => {
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
    this.channellingService.getPatientIncomeMonthly().subscribe((data: any) => {
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
