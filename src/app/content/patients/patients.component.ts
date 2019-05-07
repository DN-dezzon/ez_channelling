import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';


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
  }

  getPatients() {
    this.databaseService.query("SELECT * FROM patient").subscribe((data: []) => {
      this.patients = data;
      
      this.datatable.draw();
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
          "targets": [3]
        }],
      "order": [[0, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });
  }

   
  
}
