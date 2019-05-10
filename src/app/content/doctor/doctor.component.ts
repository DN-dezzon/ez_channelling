import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  private datatable: any;
  private doctors: any[];

  private mode = "";

  private doctor = {
    iddoctor: -1,
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
  };

  constructor(private doctorService: DoctorService) { }


  ngOnInit() {
    this.getDoctors();
  }

  ngAfterViewInit() {

    this.initTable();

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

  clickNew() {
    this.mode = 'new';
    this.doctor.iddoctor = -1;
    this.doctor.name = "";
    this.doctor.specialization = "";
    this.doctor.base_hospital = "";
    this.doctor.contactNo = "";
    this.doctor.fee = 0.0;
    this.doctor.description = "";
    (<any>$("#newDoctor")).modal();
  }

  getDoctors() {
    //this.datatable.destroy();

    this.doctorService.getDoctors().subscribe((data: any) => {
      this.doctors = data;
      this.addIndex(this.doctors);
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      console.log(err);
    }
    );
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index + 1;
    }
  }

  saveDoctor() {
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.saveDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  updateDoctor() {
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.updateDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  deleteDoctor() {
    (<any>$("#newDoctor")).modal("hide");
    this.doctorService.deleteDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
    }, (err) => {
      console.log(err);
    }
    );
  }

  showUpdateModal(doctor: any) {
    this.mode = 'update';
    this.doctor = doctor;
    (<any>$("#newDoctor")).modal();
  }

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
      "pagingType": "full_numbers",
      responsive: true,
      columns: [
        {
          data: "index"
        },
        {
          data: "iddoctor"
        },
        {
          data: "name"
        },
        {
          data: "specialization"
        },
        {
          data: "base_hospital"
        },
        {
          data: "contactNo"
        },
        {
          data: "fee"
        },
        {
          data: "description"
        },
        //create three buttons columns
        {
          defaultContent: `<button type="button" class="btn btn-xs btn-warning showUpdateModal"><span class="glyphicon glyphicon-edit"></span>
          </button>`
        }
      ],
      "columnDefs": [
        {
          "searchable": false,
          sortable: false,
          "class": "index",
          "targets": [0]
        },
        {
          "searchable": false,
          "orderable": false,
          "targets": [4]
        }],
      "order": [[1, 'asc']],
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
        // _currClassRef.showValue(row.data().FirstName);
      }
      else if ($(this).hasClass("showLButton")) {
        //_currClassRef.showValue(row.data().LastName);
      }
      else if ($(this).hasClass("showUpdateModal")) {
        _currClassRef.showUpdateModal(row.data());
      }

    })
  }


}
