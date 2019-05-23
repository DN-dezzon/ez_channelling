import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HomeService } from './home.servie';
import { Observable } from 'rxjs';


declare var $: any;
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
  
})
export class HomeComponent implements OnInit {
  elementRef: ElementRef;
  private datatable: any;
  private doctors: any[];
  private doctor_appointments: any[];
  private todaySchedule: any[];
  private OptionsSelect: -1;
  private patients: any[];
  private patient_data: any[];
  private doctor_data: any[];

  private mode = "";
  private doctor = {
    doctor_iddoctor: "",
    iddoctor_schedule: "",
    iddoctor: -1,
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
    datee: "",
    number: "",
    timee: "",
    tablelength: "",
    totalAppointment: "",
    todayPatientVisits:0
  };

  private patient = {
    idpatient: -1,
    name: "",
    contactNo: "",
    amount:"",
    monthly_income:""
  };
  myDate = new Date();
  constructor(private homeService: HomeService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    $('#channeling_date').datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: true,
      autoclose: true
    });  
    
    this.getDoctors();
    this.getPatients();
  }

  searchPatientName() {
    // this.patient.idpatient = value;
    this.getPatientById(this.patient.idpatient);
  }
  searchDoctorFee(value) {
    this.doctor.iddoctor = value;
    this.getDoctorById(this.doctor);
  }
  searchAppointment(value) {
    this.doctor.datee = '2019-05-13';
    // this.getDoctorById(this.doctor); 
    this.getAppointmentNumber(this.doctor);
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
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

  getAppointmentNumber(doctor: any) {

    this.homeService.getAppointMentNumber(doctor).subscribe((data: any) => {
      this.doctor_appointments = data;
      for (let index = 0; index < this.doctor_appointments.length; index++) {
        this.doctor.number = this.doctor_appointments[index].count + 1;
        this.doctor.iddoctor = this.doctor_appointments[index].iddoctor;
      }

    }, (err) => {
      console.log(err);
    });
  }


  createDropDown() {

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
          .attr("title", value + " is a new doctor")
          .tooltip("open");
        //this.element.val("");
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


  makeAppointment() {
    alert(this.patient.name + " " + this.doctor.iddoctor_schedule);
    this.homeService.saveAppointment(this.patient, this.doctor).subscribe((data: any) => {
      // this.getPatients();
    }, (err) => {
      console.log(err);
    }
    );
  }
  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      console.log(array[index].index);
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
          this.doctor.totalAppointment="";
        
          for (let index = 0; index < this.doctor_appointments.length; index++) { 
            this.doctor.totalAppointment = this.doctor_appointments[index].count; 
            this.doctor.todayPatientVisits= Number(this.doctor.todayPatientVisits)+Number(this.doctor_appointments[index].count)
          }
          this.todaySchedule[index].totalAppointment=this.doctor.totalAppointment;
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
        console.log(   this.patient.amount )
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
