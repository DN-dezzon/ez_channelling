import { Component, OnInit, ViewChild } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

var ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  public members: any;
  constructor() { }


  ngOnInit() {
    this.members = [
      { 'code': '1', 'name': 'Richard Wickramasinghe', 'position': 'external', 'representative': '5', 'nic': '123', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
      { 'code': '2', 'name': 'Vajira Dabare', 'position': 'external', 'representative': '5', 'nic': '123', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
      { 'code': '3', 'name': 'Chandana Jayaweera', 'position': 'external', 'representative': '5', 'nic': '', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
      { 'code': '4', 'name': 'Ruwan Wickramsinghe', 'position': 'external', 'representative': '5', 'nic': '123', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
      { 'code': '5', 'name': 'Nuwan Wickramasinghe', 'position': 'Animator', 'representative': '5', 'nic': '123', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
      { 'code': '6', 'name': 'Madhawa Dabare', 'position': 'Chairman', 'representative': '6', 'nic': '123', 'phone': '0112243567', 'email': 'dabaremadhava@gmail.com' },
      { 'code': '7', 'name': 'Avishka Jayaweera', 'position': 'Deputy Chairman', 'representative': '7', 'nic': '942761996V', 'phone': '0112243567', 'email': 'richard.wickramasinghe@gmail.com' },
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
          "targets": [7]
        }],
      "order": [[0, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5
    });
  }

  getPosOrRep(member) {
    if (member.code == member.representative) {
      return member.position;
    } else {
      return 'Ex - Rep: ' + this.members.find(x => x.code == member.representative).name;
    }
  }

}
