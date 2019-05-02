import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
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
