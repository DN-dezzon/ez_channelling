import { Component, OnInit, ElementRef } from '@angular/core';
import { HomeService } from './home.servie';
import { Observable } from 'rxjs';

declare var $: any;
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    elementRef: ElementRef;
    private datatable: any;
    private doctors: any[];
    private doctor_appointments:any[];
    private OptionsSelect: -1;
  
    private mode = "";
    private doctor = {
      iddoctor_schedule:"",
      iddoctor: -1,
      name: "",
      specialization: "",
      base_hospital: "",
      contactNo: "",
      fee: 0.0,
      description: "",
      datee:"",
      number:""  
    };

    private doctor_appointment = { 
      count:""
      
    };
    private patients: any[]; 
    private patient_data: any[]; 
    private doctor_data: any[]; 

    private patient = {
      idpatient: -1,
      name: "",
      contactNo: "",
    };

    private patientData = {
      idpatient: -1,
      name: "",
      contactNo: "",
    };
  constructor(private homeService: HomeService) { }

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

  searchPatientName(value) {
    this.patient.idpatient = value;
    this.getPatientById(this.patient.idpatient);
  }
  searchDoctorFee(value) {  
    this.doctor.iddoctor=value;
    this.getDoctorById(this.doctor);
  }
  searchAppointment(value) { 
    this.doctor.datee='2019-05-12';
    // this.getDoctorById(this.doctor); 
    this.getAppointmentNumber(this.doctor);
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
        this.patient_data[index].index = index + 1;
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

     // Load doctor to dropdown
     getDoctorById(did:any) {
      this.homeService.getDoctorById(did).subscribe((data: any) => { 
        this.doctor_data = data; 
        for (let index = 0; index < this.doctor_data.length; index++) { 
          this.doctor.fee=this.doctor_data[index].fee; 
        }
      }, (err) => {
        console.log(err);
      }
      );
    }

    getAppointmentNumber(doctor:any) { 
     
      this.homeService.getAppointMentNumber(doctor).subscribe((data: any) => {
        this.doctor_appointments = data;
        for (let index = 0; index < this.doctor_appointments.length; index++) { 
          console.log(this.doctor_appointments[index].count);
          console.log(this.doctor_appointments[0]);
          this.doctor.number=this.doctor_appointments[index].count; 
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
        this._createShowAllButton();
      },

      _createAutocomplete: function () {
        var selected = this.element.children(":selected"),
          value = selected.val() ? selected.text() : "";

        this.input = $("<input>")
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
          .val("")
          .attr("title", value + " is a new doctor")
          .tooltip("open");
        this.element.val("");
        this._delay(function () {
          this.input.tooltip("close").attr("title", "");
        }, 2500);
        this.input.autocomplete("instance").term = "";
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
  }
}
