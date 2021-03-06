import { Component, OnInit } from '@angular/core';
import { TransactionsService } from './transactions.servie';
import { company, product, medicalCenter } from 'src/environments/environment.prod';
import { DatabaseService } from 'src/app/database.service';

declare let swal: any;
declare let toastr: any;
@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  datatable: any;
  // datatable_report: any;
  // datatable_income: any;
  // datatable_expence: any;
  transactions: any[];
 
  // income: any[];
  // expences: any[];
  medicalCenter: any;
  transactionsRequest = {
    daterange: "",
    from_datee: "",
    to_datee: "",
    income:true,
    expenses:true,
  };
  
  transactions_report={
    transactions_r:this.transactions,
    transactionsRequest_r:this.transactionsRequest
  };
  constructor(private transactionsService:TransactionsService,private databaseService: DatabaseService) { 
    this.medicalCenter = medicalCenter;
  }
  
  ngOnInit() {
  }

  postProcessData(array: any[]) {
    let balance = 0;
    for (let index = array.length - 1; index > -1 ; index--) {
      array[index].index = index + 1;
      if(array[index].status == 'Paid'){
        balance += array[index].income - array[index].expense;
      }
      array[index].balance = balance;
      array[index].code = "INV-";
      if(array[index].tablee == "doctor_invoice"){
        array[index].code = "GRN-";
      }
      array[index].code += array[index].id;
    }
  }

  getTransactionReport(){ 
    // this.getTransactions();
  }

  getTransactions() {
    this.transactions = []; 
    if(this.datatable){
      this.datatable.clear();
    }
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


          toastr.success("From "+this.transactionsRequest.from_datee+" To "+this.transactionsRequest.to_datee, "Data retrieved");
        }, (err) => {
          this.datatable.clear();
          this.datatable.rows.add(this.transactions);
          this.datatable.draw();
          toastr.error('While fetching transactions details', 'Data fetch error');
        }
        );
      }
    }
  }

  // getIncome() {
  //   this.income = [];
  //
  //   this.transactionsRequest.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeTransactions")).value;
  //
  //   let dates = this.transactionsRequest.daterange.split("-");
  //   if (dates.length != 2) {
  //     toastr.warning('Please select a valid date range', 'Date range invalid');
  //   } else {
  //     let from = dates[0].trim().split("/");
  //     let to = dates[1].trim().split("/");
  //
  //     if (from.length != 3 || to.length != 3) {
  //       toastr.warning('Please select a valid date range', 'Date range invalid');
  //     } else {
  //       this.transactionsRequest.from_datee = from[2] + "-" + from[0] + "-" + from[1];//yyyymmdd
  //       this.transactionsRequest.to_datee = to[2] + "-" + to[0] + "-" + to[1];//yyyymmdd
  //
  //       this.transactionsService.getIncome(this.transactionsRequest).subscribe((data: any) => {
  //         this.income = data;
  //         this.postProcessData(this.income);
  //         this.datatable_income.clear();
  //         this.datatable_income.rows.add(this.income);
  //         this.datatable_income.draw();
  //         this.resetTableListners();
  //
  //
  //       }, (err) => {
  //         this.datatable_income.clear();
  //         this.datatable_income.rows.add(this.income);
  //         this.datatable_income.draw();
  //
  //         toastr.error('While fetching transactions details', 'Data fetch error');
  //       }
  //       );
  //     }
  //   }
  // }

  // getExpence() {
  //   this.expences = [];
  //
  //   this.transactionsRequest.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeTransactions")).value;
  //
  //   let dates = this.transactionsRequest.daterange.split("-");
  //   if (dates.length != 2) {
  //     toastr.warning('Please select a valid date range', 'Date range invalid');
  //   } else {
  //     let from = dates[0].trim().split("/");
  //     let to = dates[1].trim().split("/");
  //
  //     if (from.length != 3 || to.length != 3) {
  //       toastr.warning('Please select a valid date range', 'Date range invalid');
  //     } else {
  //       this.transactionsRequest.from_datee = from[2] + "-" + from[0] + "-" + from[1];//yyyymmdd
  //       this.transactionsRequest.to_datee = to[2] + "-" + to[0] + "-" + to[1];//yyyymmdd
  //
  //       this.transactionsService.getExpenses(this.transactionsRequest).subscribe((data: any) => {
  //         this.expences = data;
  //         this.postProcessData(this.expences);
  //         this.datatable_expence.clear();
  //         this.datatable_expence.rows.add(this.expences);
  //         this.datatable_expence.draw();
  //         // this.resetTableListners();
  //
  //
  //       }, (err) => {
  //         this.datatable_expence.clear();
  //         this.datatable_expence.rows.add(this.expences);
  //         this.datatable_expence.draw();
  //
  //         toastr.error('While fetching transactions details', 'Data fetch error');
  //       }
  //       );
  //     }
  //   }
  // }


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
            data: "status"
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
            defaultContent: `
                            <button type="button" class="btn btn-xs btn-danger showReportModal">
                                <span class="glyphicon glyphicon-remove"></span>
                            </button>
                            `
          }
        ],
        "columnDefs": [
          {
            "className": "text-center",
            "targets": [0]
          }, 
          {
            "orderable": false,
            "className": "text-center",
            "targets": [1]
          },
          {
            "className": "text-center",
            "targets": [3]
          },
         
          {
            "className": "text-center text-warning",
            "targets": [4]
          },
          {
            "className": "text-right text-info",
            "targets": [5]
          },
          {
            "className": "text-right text-danger",
            "targets": [6]
          },
          {
            "className": "text-right text-success",
            "searchable": false,
            "orderable": false,
            "targets": [7]
          },
          {
            "className": "text-center",
            "searchable": false,
            "orderable": false,
            "targets": [8]
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

    // if(!this.datatable_expence){
    //   this.datatable_expence= (<any>$('#editable_expence')).DataTable({
    //     responsive: true,
    //     columns: [
    //       {
    //         data: "index"
    //       },
    //       {
    //         data: "date"
    //       },
    //       {
    //         data: "name"
    //       },
    //       {
    //         data: "code"
    //       },
    //       {
    //         data: "status"
    //       },
    //       {
    //         data: "income"
    //       },
    //       {
    //         defaultContent: `
    //                         <button type="button" class="btn btn-xs btn-danger showReportModal">
    //                             <span class="glyphicon glyphicon-remove"></span>
    //                         </button>
    //                         `
    //       }
    //     ],
    //     "columnDefs": [
    //       {
    //         "className": "text-center",
    //         "targets": [0]
    //       },
    //       {
    //         "orderable": false,
    //         "className": "text-center",
    //         "targets": [1]
    //       },
    //       {
    //         "className": "text-center",
    //         "targets": [3]
    //       },
    //
    //       {
    //         "className": "text-center text-warning",
    //         "targets": [4]
    //       },
    //       {
    //         "className": "text-right text-info",
    //         "targets": [5]
    //       },
    //
    //     ],
    //
    //   });
    // }
    //
    // if(!this.datatable_income){
    //   this.datatable_income= (<any>$('#editable_income')).DataTable({
    //     responsive: true,
    //     columns: [
    //       {
    //         data: "index"
    //       },
    //       {
    //         data: "date"
    //       },
    //       {
    //         data: "name"
    //       },
    //       {
    //         data: "code"
    //       },
    //       {
    //         data: "status"
    //       },
    //       {
    //         data: "income"
    //       },
    //       {
    //         defaultContent: `
    //                         <button type="button" class="btn btn-xs btn-danger showReportModal">
    //                             <span class="glyphicon glyphicon-remove"></span>
    //                         </button>
    //                         `
    //       }
    //     ],
    //     "columnDefs": [
    //       {
    //         "className": "text-center",
    //         "targets": [0]
    //       },
    //       {
    //         "orderable": false,
    //         "className": "text-center",
    //         "targets": [1]
    //       },
    //       {
    //         "className": "text-center",
    //         "targets": [3]
    //       },
    //
    //       {
    //         "className": "text-center text-warning",
    //         "targets": [4]
    //       },
    //       {
    //         "className": "text-right text-info",
    //         "targets": [5]
    //       },
    //
    //     ],
    //
    //   });
    // }
    //
    // if(!this.datatable_report){
    //   this.datatable_report = (<any>$('#editable2')).DataTable({
    //     responsive: true,
    //     columns: [
    //       {
    //         data: "index"
    //       },
    //       {
    //         data: "date"
    //       },
    //       {
    //         data: "name"
    //       },
    //       {
    //         data: "code"
    //       },
    //       {
    //         data: "income"
    //       },
    //       {
    //         data: "expense"
    //       },
    //       {
    //         data: "balance"
    //       },
    //
    //     ],
    //     "columnDefs": [
    //       {
    //         "targets": [1]
    //       },
    //
    //       {
    //         "className": "text-right text-success",
    //         "searchable": false,
    //         "orderable": false,
    //         "targets": [6]
    //       },
    //
    //       {
    //         "className": "text-right text-danger",
    //         "targets": [5]
    //       },
    //       {
    //         "className": "text-right text-info",
    //         "targets": [4]
    //       },
    //       {
    //         "className": "text-center",
    //         "targets": [0]
    //       },
    //       {
    //         "className": "text-center",
    //         "targets": [1]
    //       },
    //       {
    //         "className": "text-center",
    //         "targets": [3]
    //       },
    //     ],
    //
    //   });
    // }

  }

  cancelTransaction(transaction:any){
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
          _this.transactionsService.cancelTransaction(transaction).subscribe((data: any) => {
            _this.getTransactions();
            toastr.success("Success", "Cancelled transaction");
          }, (err) => {
            toastr.error('While cancelling transaction', 'Data update error');
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
        _currClassRef.cancelTransaction(row.data());
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

  clickAll(){
    this.setDefaultButtonColour();
    document.getElementById("transactionsAll").className = "btn btn-sm btn-success";
    this.transactionsRequest.income = true;
    this.transactionsRequest.expenses = true;
    this.getTransactions();
  }
  clickIncome(){
    this.setDefaultButtonColour();
    document.getElementById("transactionsIncome").className = "btn btn-sm btn-success";
    this.transactionsRequest.income = true;
    this.transactionsRequest.expenses = false;
    this.getTransactions();
  }
  clickExpenses(){
    this.setDefaultButtonColour();
    document.getElementById("transactionsExpenses").className = "btn btn-sm btn-success";
    this.transactionsRequest.income = false;
    this.transactionsRequest.expenses = true;
    this.getTransactions();
  }

  setDefaultButtonColour(){
    document.getElementById("transactionsAll").className = "btn btn-sm btn-default";
    document.getElementById("transactionsIncome").className = "btn btn-sm btn-default";
    document.getElementById("transactionsExpenses").className = "btn btn-sm btn-default";
  }

  printIncome_Outcome(){
    this.transactions_report={
      transactions_r:this.transactions,
      transactionsRequest_r:this.transactionsRequest
    };
    console.log(this.transactions_report);
    this.transactionsService.printReport(this.transactions_report).subscribe((data: any) => {
      console.log(data);
 
      toastr.info("Printing.....!");
    }, (err) => {
      console.log(err);
      toastr.error("Please try again!");
    }); 
    
  }
}
