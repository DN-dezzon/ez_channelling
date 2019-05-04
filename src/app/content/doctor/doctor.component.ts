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



    (<any>$('.i-checks')).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });

    /* initialize the external events
     -----------------------------------------------------------------*/


     (<any>$('#external-events div.external-event')).each(function () {

      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true // maintain when user navigates (see docs on the renderEvent method)
      });

      // make the event draggable using jQuery UI
      (<any>$(this)).draggable({
        zIndex: 1111999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });


    /* initialize the calendar
     -----------------------------------------------------------------*/
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    (<any>$('#calendar')).fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function () {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      },
      events: [
        {
          title: 'All Day Event',
          start: new Date(y, m, 1)
        },
        {
          title: 'Long Event',
          start: new Date(y, m, d - 5),
          end: new Date(y, m, d - 2)
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d - 3, 16, 0),
          allDay: false
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d + 4, 16, 0),
          allDay: false
        },
        {
          title: 'Meeting',
          start: new Date(y, m, d, 10, 30),
          allDay: false
        },
        {
          title: 'Lunch',
          start: new Date(y, m, d, 12, 0),
          end: new Date(y, m, d, 14, 0),
          allDay: false
        },
        {
          title: 'Birthday Party',
          start: new Date(y, m, d + 1, 19, 0),
          end: new Date(y, m, d + 1, 22, 30),
          allDay: false
        },
        {
          title: 'Click for Google',
          start: new Date(y, m, 28),
          end: new Date(y, m, 29),
          url: 'http://google.com/'
        }
      ]
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
