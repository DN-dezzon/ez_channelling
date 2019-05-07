import { Component, OnInit } from '@angular/core';
import { PatientApiService } from './service/api.services';

declare var $: any;
  
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit { 
  public patients: any;

  private patientData: Array<any> = [];
  
  private patientDetails = {
    patientHistory:false,
    code:"",
    name:"",
    contactNo:""
  };
  constructor(private _apiService: PatientApiService) { }


  ngOnInit() {
  
    this.patients = [
      { 'code': '1', 'name': 'Richard Wickramasinghe','phone': '0112243567'},
      { 'code': '2', 'name': 'Vajira Dabare','phone': '0112243567'},
      { 'code': '3', 'name': 'Richard Wickramasinghe','phone': '0112243567'},
      { 'code': '4', 'name': 'Chandana Jayaweera','phone': '0112243567'},
      { 'code': '5', 'name': 'Nuwan Wickramasinghe','phone': '0112243567'},
      { 'code': '6', 'name': 'Avishka Jayaweera','phone': '0112243567'},
      { 'code': '7', 'name': 'Madhawa Dabare','phone': '0112243567'}, 
    ];
  }

  ngAfterViewInit() {
    this.drawTable();

    (<any>$('.data_3 .input-group.date')).datepicker({
      startView: 2,
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });

    (<any>$(".select2_demo_3")).select2({
      dropdownCssClass: 'custom-dropdown'
    });

    (<any>$(".select2_demo_3")).on('select2:open', function (e) {
      $('.custom-dropdown').parent().css('z-index', 99999);
    });
  }
  
  drawTable() {
    (<any>$('#editable')).DataTable({

      "columnDefs": [
        {
          "searchable": false,
          "visible": false,
          "targets": [0]
        },
        {
          "searchable": false,
          "orderable": false,
          "targets": [4,5]
        }],
      "order": [[0, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });
  }
  showPatientHistory(){
    this.patientDetails.patientHistory=false;  
    this.patientDetails.patientHistory=true; 
  }

  rowSelection(patient, i, code){
     this.patientDetails.code=patient.code;

  }
  getPosOrRep(patient) {
    if (patient.code == patient.representative) {
      return patient.position;
    } else {
      return 'Ex - Rep: ' + this.patients.find(x => x.code == patient.representative).name;
    }
  }

  getPData(){
    
  }
}
