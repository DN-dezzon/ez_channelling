import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  private patients: any;

  constructor(private databaseService: DatabaseService) { }


  ngOnInit() {
    this.initTable();
    var myVar = setInterval(this.checkTable, 1000);
  }

  dataSet = false;

  checkTable(){
    alert(!this.dataSet && (this.patients.length == $('#editable tbody tr').length));
    if(!this.dataSet && (this.patients.length == $('#editable tbody tr').length)){
      this.dataSet = true;
      this.initTable();
      alert($('#editable tbody tr').length);
    }
  }

  getPatients() {
    this.datatable.destroy();
 
    this.databaseService.getPatients().subscribe((data: []) => {
        this.patients = data;
        this.dataSet = false;

        setTimeout(() => {
          if($('#editable tbody tr').length == this.patients.length ){
            this.initTable();
          }
        }, 1000);
        
      }, (err) => {
        console.log(err);
      }
 
    );
  }


  savePatient() {
    this.databaseService.query("INSERT INTO patient VALUES(4,'testing','134123')").subscribe((data: []) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    }
    );
  }


  ngAfterViewInit() {
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

  datatable:any;

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
      "columnDefs": [
        {
          "searchable": false,
          "visible": false,
          "targets": [0]
        },
        {
          "searchable": false,
          "orderable": false,
          "targets": [4]
        }],
      "order": [[0, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });
  }

   
  
}
