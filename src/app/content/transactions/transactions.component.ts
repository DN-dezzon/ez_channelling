import { Component, OnInit } from '@angular/core';
import { TransactionsService } from './transactions.servie';
declare let swal: any;
declare let toastr: any;
@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  datatable: any;
  transactions: any[];

  transactionsRequest = {
    daterange: "",
    from_datee: "",
    to_datee: "",
  };

  constructor(private transactionsService:TransactionsService) { }

  ngOnInit() {
  }

  postProcessData(array: any[]) {
    let balance = 0;
    for (let index = array.length - 1; index > -1 ; index--) {
      array[index].index = index + 1;
      balance += array[index].income - array[index].expense;
      array[index].balance = balance;
      array[index].code = "INV-";
      if(array[index].tablee == "doctor_invoice"){
        array[index].code = "GRN-";
      }
      array[index].code += array[index].id;
    }
  }

  getTransactions() {
    this.transactions = [];

    this.transactionsRequest.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeTransactions")).value;

    let dates = this.transactionsRequest.daterange.split("-");
    if (dates.length != 2) {
      toastr.warning('Please select a valid date range', 'Date range invalid');
    } else {
      let from = dates[0].trim().split("/");
      let to = dates[1].trim().split("/");

      if (from.length != 3 || to.length != 3) {
        toastr.warning('Please select a valid date range', 'Date range invalid');
      } else {
        this.transactionsRequest.from_datee = from[2] + "-" + from[0] + "-" + from[1];//yyyymmdd
        this.transactionsRequest.to_datee = to[2] + "-" + to[0] + "-" + to[1];//yyyymmdd
        
        this.transactionsService.getTransactions(this.transactionsRequest).subscribe((data: any) => {
          this.transactions = data;
          this.postProcessData(this.transactions);
          this.datatable.clear();
          this.datatable.rows.add(this.transactions);
          this.datatable.draw();
          this.resetTableListners();
        }, (err) => {
          this.datatable.clear();
          this.datatable.rows.add(this.transactions);
          this.datatable.draw();
          toastr.error('While fetching tramsactions details', 'Data fetch error');
        }
        );
      }
    }
  }

  ngAfterViewInit() {
    let d = new Date();
    this.transactionsRequest.daterange = "01/01/2000 - " + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    
    this.initDatepickers();
    this.initTable();
    
    (<HTMLInputElement>document.getElementById("selectDateRangeTransactions")).value = this.transactionsRequest.daterange;
    
    this.getTransactions();
  }

  initTable() {
    if(!this.datatable){
      this.datatable = (<any>$('#editable')).DataTable({
        responsive: true,
        columns: [
          {
            data: "index"
          },
          {
            data: "date"
          },
          {
            data: "name"
          },
          {
            data: "code"
          },
          {
            data: "income"
          },
          {
            data: "expense"
          },{
            data: "balance"
          },
          {
            defaultContent: `<button type="button" class="btn btn-xs btn-danger showReportModal">
                                <span class="glyphicon glyphicon-trash"></span>
                            </button>
                            `
          }
        ],
        "columnDefs": [
          {
            
            "orderable": false,
            "targets": [1]
          },
          {
            "className": "text-right text-success",
            "searchable": false,
            "orderable": false,
            "targets": [6]
          },
          {
            "className": "text-center",
            "searchable": false,
            "orderable": false,
            "targets": [7]
          },
          {
            "className": "text-right text-danger",
            "targets": [5]
          },
          {
            "className": "text-right text-info",
            "targets": [4]
          },
          {
            "className": "text-center",
            "targets": [0]
          },
          {
            "className": "text-center",
            "targets": [1]
          },
          {
            "className": "text-center",
            "targets": [3]
          },
        ],
        "order": [[0, 'asc']],
        "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
        "iDisplayLength": 5,
        "fnDrawCallback": (osSettings) => {
          this.resetTableListners();
        }
      });
    }
    
  }

  deleteTransaction(transaction:any){
    let _this = this;
    swal({
      title: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    },
      function (isConfirm) {
        if (isConfirm) {
          _this.transactionsService.deleteTransaction(transaction).subscribe((data: any) => {
            _this.getTransactions();
            toastr.success("Success", "Deleted transaction");
          }, (err) => {
            toastr.error('While deleting transaction', 'Data deletion error');
          }
          );
        }
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
      if ($(this).hasClass("showReportModal")) {
        _currClassRef.deleteTransaction(row.data());
      }
      else if ($(this).hasClass("showUpdateModal")) {
        //_currClassRef.showUpdateModal(row.data());
      }

    })
  }

  initDatepickers() {
    (<any>$('#selectDateRangeTransactions')).daterangepicker();
    $('#selectDateRangeTransactions').on('change.datepicker', (ev) => {
      this.getTransactions();
    });
  }
}
