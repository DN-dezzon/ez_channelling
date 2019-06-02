import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from './patient.service';
import { Observable } from 'rxjs';

declare let swal: any;
declare let toastr: any;
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  datatable: any;
  datatable_history: any;
  patients: any[];
  all_patientHistory: any[];
  mode = "";

  patient = {
    idpatient: -1,
    name: "",
    contactNo: "",
  };

  patientHistory = {
    number: "",
    name: "",
    issued_datetime: "",
    fee: "",
    datee: "",
    timee: "",
    payment_status: ""
  };




  patient_ui = {
    patientHistory: false
  }
  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.getPatients();
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
    this.initToasterNotifications();
  }

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
      responsive: true,
      columns: [
        {
          data: "index"
        },
        {
          data: "idpatient"
        },
        {
          data: "name",
        },
        {
          data: "contactNo"
        },
        //create three buttons columns
        {
          defaultContent: `<button type="button" class="btn btn-xs btn-warning showUpdateModal"><span class="glyphicon glyphicon-edit"></span>
          </button>   <button type="button" class="btn btn-xs btn-info showHistory"><span class="glyphicon glyphicon-info-sign"></span>
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
      "iDisplayLength": 5,
      "fnDrawCallback": (osSettings) => {
        this.resetTableListners();
      }
    });
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index + 1;
    }
  }

  getNextPatientId() {
    this.patientService.getNextPatientId().subscribe((data: any) => {
      this.patient.idpatient = data.idpatient;
      (<any>$("#newMember")).modal();
    }, (err) => {
      (<any>$("#newMember")).modal('hide');
      toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  // Load ptient to main table
  getPatients() {
    this.patientService.getPatients().subscribe((data: any) => {

      this.patients = data;
      this.addIndex(this.patients);
      this.datatable.clear();
      this.datatable.rows.add(this.patients);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      console.log(err);
      toastr.error('While fetching patient details', 'Data fetch error');
    }
    );
  }

  // Save new patient
  savePatient() {
    this.patientService.savePatient(this.patient).subscribe((data: any) => {
      this.getPatients();
      (<any>$("#newMember")).modal("hide");
      toastr.success("Success", "New patient inserted");
    }, (err) => {
      console.log(err);
      toastr.error('While saving patient', 'Data save error');
    }
    );
  }


  updateDoctor() {
    this.patientService.updatePatient(this.patient).subscribe((data: any) => {
      this.getPatients();
      (<any>$("#newMember")).modal("hide");
      toastr.success("Success", "Updated patient details");
    }, (err) => {
      console.log(err);
      toastr.error('While updating patient', 'Data update error');
    }
    );
  }

  deleteDoctor() {
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
          _this.patientService.deletePatient(_this.patient).subscribe((data: any) => {
            _this.getPatients();
            (<any>$("#newMember")).modal("hide");
            toastr.success("Success", "Deleted patient");
          }, (err) => {
            toastr.error('While deleting patient', 'Data deletion error');
          }
          );
        } else {
          (<any>$("#newMember")).modal("hide");
        }
      });
  }

  clickNew() {
    this.mode = 'new';
    this.patient.idpatient = -1;
    this.patient.name = "";
    this.patient.contactNo = "";
    this.getNextPatientId();
  }

  showUpdateModal(patient: any) {
    this.mode = 'update';
    this.patient = patient;
    (<any>$("#newMember")).modal();
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
      } else if ($(this).hasClass("showUpdateModal")) {
        _currClassRef.showUpdateModal(row.data());
      } else if ($(this).hasClass("showHistory")) {
        _currClassRef.showHistoryTable(row.data());

      }

    })
  }

  showValue(value) {
    alert(value)
  }


  // Patient history mamagement
  showHistoryTable(patient: any) {
    this.patient_ui.patientHistory = true;
    this.getPatientHistory(patient);
  }
  // load patient history table
  getPatientHistory(patient: any) {
    this.patientService.getPatientHistory(patient).subscribe((data: any) => {

      this.all_patientHistory = data;

      this.addIndex(this.all_patientHistory);
      this.datatable_history.clear();
      this.datatable_history.rows.add(this.all_patientHistory);
      this.datatable_history.draw();
      // this.resetTableListners();
    }, (err) => {
      console.log(err);
      toastr.error('While fetching patient details', 'Data fetch error');
    }
    );
  }

  initToasterNotifications() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "progressBar": true,
      "preventDuplicates": false,
      "positionClass": "toast-top-right",
      "onclick": null,
      "showDuration": "400",
      "hideDuration": "1000",
      "timeOut": "7000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }

}