import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  public allPatients: any[];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.initTable();
  }


  getPatients() {
    //this.datatable.destroy();

    this.databaseService.getPatients().subscribe((data: any) => {
      this.allPatients = data;

      this.datatable.clear();
      this.datatable.rows.add(data);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      console.log(err);
    }
    );
  }


  savePatient() {

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

  datatable: any;

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
      "pagingType": "full_numbers",
      responsive: true,
      columns: [
        {
          data: "idpatient"
        },
        {
          data: "idpatient"
        },
        {
          data: "name"
        },
        {
          data: "contactNo"
        },
        //create three buttons columns
        {
          defaultContent: `<button type="button" class="btn btn-xs btn-warning showIdButton"><span class="glyphicon glyphicon-edit"></span>
          </button>`
        }
      ],
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
        _currClassRef.showValue(row.data().FirstName);
      }
      else if ($(this).hasClass("showLButton")) {
        _currClassRef.showValue(row.data().LastName);
      }
      else if ($(this).hasClass("showIdButton")) {
        _currClassRef.showValue(row.data().idpatient);
      }

    })
  }

  showValue(value) {
    alert(value)
  }

}
