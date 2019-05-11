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
    private OptionsSelect: -1;
  
    private mode = "";
    private doctor = {
      iddoctor: -1,
      name: "",
      specialization: "",
      base_hospital: "",
      contactNo: "",
      fee: 0.0,
      description: "",
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
    this.getDoctors();
    this.getPatients();
    this.createDropDown(); 
  }

  searchPatientName(value) {
    this.patient.idpatient=value;
    this.getPatientById(this.patient.idpatient);
  }
  searchDoctorFee(value) { 
    this.doctor.iddoctor=value;
    this.getDoctorById(this.doctor.iddoctor);
  }

  getDoctors() {
    //this.datatable.destroy();
   
    this.homeService.getDoctors().subscribe((data: any) => {
      this.doctors = data;
      this.addIndex(this.doctors);
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw(); 
     
    }, (err) => {
      console.log(err);
    }
    );
  }
   // Load ptient to dropdown
   getPatients() {
    this.homeService.getPatients().subscribe((data: any) => {

      this.patients = data;
      this.addIndex(this.patients);
      this.datatable.clear();
      this.datatable.rows.add(this.patients);
      this.datatable.draw(); 
    }, (err) => {
      console.log(err);
    }
    );
  }
   // Load ptient to dropdown
   getPatientById(patient:any) {
    this.homeService.getPatientById(patient).subscribe((data: any) => {

      this.patient_data = data;
      this.addIndex(this.patient_data);
      for (let index = 0; index < this.patient_data.length; index++) {
        console.log(this.patient_data[index].name);
        this.patient.name=this.patient_data[index].name;
        this.patient_data[index].index = index + 1; 
      }
    }, (err) => {
      console.log(err);
    }
    );
  }

     // Load doctor to dropdown
     getDoctorById(doctor:any) {
      this.homeService.getDoctorById(doctor).subscribe((data: any) => {
  
        this.doctor_data = data;
        this.addIndex(this.doctor_data);
        for (let index = 0; index < this.doctor_data.length; index++) {
          console.log(this.doctor_data[index].name);
          this.doctor.fee=this.doctor_data[index].fee;
          this.patient_data[index].index = index + 1; 
        }
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
 
  createDropDown(){
    $( function() {
      $.widget( "custom.combobox", {
        _create: function() {
          this.wrapper = $( "<span>" )
            // .addClass( "custom-combobox" )
            .insertAfter( this.element );
   
          this.element.hide();
          this._createAutocomplete();
          this._createShowAllButton();
        },
   
        _createAutocomplete: function() {
          var selected = this.element.children( ":selected" ),
            value = selected.val() ? selected.text() : "";
   
          this.input = $( "<input>" )
            .appendTo( this.wrapper )
            .val( value )
            .attr( "title", "" )
            .addClass( "form-control m-b" )
            .autocomplete({
              delay: 0,
              minLength: 0,
              source: $.proxy( this, "_source" )
            })
            .tooltip({
              classes: {
                "ui-tooltip": "ui-state-highlight"
              }
            });
   
          this._on( this.input, {
            autocompleteselect: function( event, ui ) {
              ui.item.option.selected = true;
              this._trigger( "select", event, {
                item: ui.item.option
              });
            },
   
            autocompletechange: "_removeIfInvalid"
          });
        },
    
   
        _source: function( request, response ) {
          var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
          response( this.element.children( "option" ).map(function() {
            var text = $( this ).text();
            if ( this.value && ( !request.term || matcher.test(text) ) )
              return {
                label: text,
                value: text,
                option: this
              };
          }) );
        },
   
        _removeIfInvalid: function( event, ui ) {
   
          // Selected an item, nothing to do
          if ( ui.item ) {
            return;
          }
   
          // Search for a match (case-insensitive)
          var value = this.input.val(),
            valueLowerCase = value.toLowerCase(),
            valid = false;
          this.element.children( "option" ).each(function() {
            if ( $( this ).text().toLowerCase() === valueLowerCase ) {
              this.selected = valid = true;
              return false;
            }
          });
   
          // Found a match, nothing to do
          if ( valid ) {
            return;
          }
   
          // Remove invalid value
          this.input
            .val( "" )
            .attr( "title", value + " didn't match any item" )
            .tooltip( "open" );
          this.element.val( "" );
          this._delay(function() {
            this.input.tooltip( "close" ).attr( "title", "" );
          }, 2500 );
          this.input.autocomplete( "instance" ).term = "";
        },
   
        _destroy: function() {
          this.wrapper.remove();
          this.element.show();
        }
      });
   
      $( "#combobox" ).combobox();
      $( "#toggle" ).on( "click", function() {
        $( "#combobox" ).toggle();
      });
    } );
  }
  ngAfterViewInit() {
  
  }
}
