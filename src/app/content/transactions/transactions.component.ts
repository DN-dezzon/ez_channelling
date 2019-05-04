 import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public transactions: any;
  constructor() { }


  ngOnInit() {
    this.transactions = [
      { 'trans_id': '1', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '2', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '3', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '4', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '5', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '6', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '7', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
      { 'trans_id': '8', 'issued_to': 'Richard Wickramasinghe', 'date': '2018/01/01', 'time': '05.00', 'amount': '1000.00' },
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
          "targets": [6]
        }],
      "order": [[0, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });
  }

  getPosOrRep(transaction) {
    if (transaction.code == transaction.representative) {
      return transaction.position;
    } else {
      return 'Ex - Rep: ' + this.transactions.find(x => x.code == transaction.representative).name;
    }
  }

}
