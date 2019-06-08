import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from './doctor.service';
import { company, product, medicalCenter } from 'src/environments/environment.prod';

declare let swal: any;
declare let toastr: any;
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  datatable: any;
  fullCalendar: any;
  doctors: any[];
  doctorSchedules: any[];
  schedulePatients: any[];

  company: any;
  product: any;
  medicalCenter: any;

  mode = "";

  doctor = {
    iddoctor: -1,
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
  };

  schedule = {
    iddoctor_schedule: -1,
    doctor: this.doctor,
    datee: "",//2012-12-30-----01/01/2015 - 01/31/2015
    doctor_in: "00:00:00",//23:11:22
    doctor_out: "00:00:00",
    repetive: "false",
    in_h: "8",
    in_m: "0",
    in_d: "AM",
    out_h: "10",
    out_m: "0",
    out_d: "AM",
    daterange: "",
  };

  doctorInvoice = {
    iddoctor_invoice: -1,
    datee: "",
    patient_count: 0,
    center_fee: 0,
    doc_fee: 0,
    doctor_schedule: this.schedule,
    doctor_schedule_iddoctor_schedule: -1,
    y: "0",
    m: "0",
    d: "0",
    cal: ""
  };

  reportRequest = {
    doctor: this.doctor,
    daterange: "",
    patient_count: 0,
    doc_fee: 0,
    center_fee: 0,
    from_datee: "",
    to_datee: "",
  };

  clearReportRequest() {
    this.reportRequest.patient_count = 0;
    this.reportRequest.doc_fee = 0;
    this.reportRequest.center_fee = 0;
    this.reportRequest.from_datee = "";
    this.reportRequest.to_datee = "";
  }

  clearDoctorInvoice() {
    this.doctorInvoice.iddoctor_invoice = -1;
    this.doctorInvoice.datee = "";
    this.doctorInvoice.patient_count = 0;
    this.doctorInvoice.center_fee = 0;
    this.doctorInvoice.doc_fee = 0;
    this.doctorInvoice.doctor_schedule_iddoctor_schedule = -1;
    this.doctorInvoice.y = "0";
    this.doctorInvoice.m = "0";
    this.doctorInvoice.d = "0";
    this.doctorInvoice.cal = this.getWebDate(this.doctorInvoice);
  }

  getWebDate(obj) {
    let ret = "";
    if (obj && obj.y != "0") {
      ret = obj.m + "/" + obj.d + "/" + obj.y;
    }
    return ret;
  }

  constructor(private doctorService: DoctorService) {
    this.company = company;
    this.product = product;
    this.medicalCenter = medicalCenter;let d = new Date();
    this.reportRequest.daterange = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear() + " - " + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
  }


  ngOnInit() {
    this.getDoctors();
  }

  ngAfterViewInit() {
    this.initTable();
    this.initSelect();
    this.initDatepickers();
    this.initToasterNotifications();
    this.clearDoctor();
    this.clearDoctorInvoice();
    this.clearReportRequest();
    this.clearSchedule();
  }

  clickNew() {
    this.mode = 'new';
    this.clearDoctor();
    this.getNextDoctorId();
  }

  clearDoctor() {
    this.doctor.iddoctor = -1;
    this.doctor.name = "";
    this.doctor.specialization = "";
    this.doctor.base_hospital = "";
    this.doctor.contactNo = "";
    this.doctor.fee = 0.0;
    this.doctor.description = "";
  }

  getDoctors() {
    this.doctors = [];
    this.doctorService.getDoctors().subscribe((data: any) => {
      this.doctors = data;
      this.addIndex(this.doctors);
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      this.resetTableListners();
    }, (err) => {
      this.datatable.clear();
      this.datatable.rows.add(this.doctors);
      this.datatable.draw();
      toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  datesTabSelected() {
    this.clearDoctor();
    this.clearSchedule();
    this.doctorSchedules = [];
    if (this.fullCalendar) {
      this.fullCalendar.fullCalendar('getCalendar').removeEvents();
      this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.doctorSchedules);
    }
    setTimeout(this.initCalendar, 10);
  }

  getNextDoctorId() {
    this.doctorService.getNextDoctorId().subscribe((data: any) => {
      this.doctor.iddoctor = data.iddoctor;
      (<any>$("#newDoctor")).modal();
    }, (err) => {
      toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  getNextDoctorScheduleId() {
    this.doctorService.getNextDoctorScheduleId().subscribe((data: any) => {
      this.schedule.iddoctor_schedule = data.iddoctor_schedule;
      (<any>$("#newSchedule")).modal();
    }, (err) => {
      toastr.error('While fetching schedules', 'Data fetch error');
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
      toastr.success("Success", "New doctor inserted");
    }, (err) => {
      toastr.error('While saving doctor', 'Data save error');
    }
    );
  }

  updateDoctor() {
    this.doctorService.updateDoctor(this.doctor).subscribe((data: any) => {
      this.getDoctors();
      (<any>$("#newDoctor")).modal("hide");
      toastr.success("Success", "Updated doctor details");
    }, (err) => {
      toastr.error('While updating doctor', 'Data update error');
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
          _this.doctorService.deleteDoctor(_this.doctor).subscribe((data: any) => {
            _this.getDoctors();
            (<any>$("#newDoctor")).modal("hide");
            toastr.success("Success", "Deleted doctor");
          }, (err) => {
            toastr.error('While deleting doctor', 'Data deletion error');
          }
          );
        } else {
          (<any>$("#newDoctor")).modal("hide");
        }
      });
  }

  showUpdateModal(doctor: any) {
    this.mode = 'update';
    this.doctor.iddoctor = doctor.iddoctor;
    this.doctor.name = doctor.name;
    this.doctor.specialization = doctor.specialization;
    this.doctor.base_hospital = doctor.base_hospital;
    this.doctor.contactNo = doctor.contactNo;
    this.doctor.fee = doctor.fee;
    this.doctor.description = doctor.description;
    (<any>$("#newDoctor")).modal();
  }

  showReportModal(doctor: any) {
    this.doctor.iddoctor = doctor.iddoctor;
    this.doctor.name = doctor.name;
    this.doctor.specialization = doctor.specialization;
    this.doctor.base_hospital = doctor.base_hospital;
    this.doctor.contactNo = doctor.contactNo;
    this.doctor.fee = doctor.fee;
    this.doctor.description = doctor.description;
    this.generateReport();
  }

  get12Pm(t24) {
    let ret = "AM";
    let t = t24.split(":");
    if (parseInt(t[0], 10) > 12) {
      ret = "PM";
    }
    return ret;
  }

  get12Hour(t24) {
    let t = t24.split(":");
    if (parseInt(t[0], 10) > 12) {
      t[0] = parseInt(t[0], 10) - 12;
    }
    if (t[0] == 0) {
      t[0] = 12;
    }
    return t[0];
  }

  get12Munite(t24) {
    return t24.split(":")[1];
  }

  scheduleSelected(index) {
    this.clearSchedule();
    this.schedule.iddoctor_schedule = this.doctorSchedules[index].iddoctor_schedule;
    this.schedule.datee = this.doctorSchedules[index].datee;
    this.schedule.doctor_in = this.doctorSchedules[index].doctor_in;
    this.schedule.doctor_out = this.doctorSchedules[index].doctor_out;
    this.schedule.in_h = this.get12Hour(this.schedule.doctor_in);
    this.schedule.in_m = this.get12Munite(this.schedule.doctor_in);
    this.schedule.in_d = this.get12Pm(this.schedule.doctor_in);
    this.schedule.out_h = this.get12Hour(this.schedule.doctor_out);
    this.schedule.out_m = this.get12Munite(this.schedule.doctor_out);
    this.schedule.out_d = this.get12Pm(this.schedule.doctor_out);
    let d = new Date(this.doctorSchedules[index].start);
    this.schedule.daterange = this.getWebDate(this.doctorSchedules[index]);
    this.getSchedulePatients();
    this.getDoctrInvoiceByDoctorSchedule();
  }


  getSchedulePatients() {
    this.schedulePatients = [];
    this.doctorService.getPatientsBySchedule(this.schedule).subscribe((data: any) => {
      this.schedulePatients = data;
    }, (err) => {
      toastr.error('While getting patient details', 'Data fetching error');
    }
    );
  }

  initCalendar() {
    if (!this.fullCalendar) {
      this.fullCalendar = (<any>$('#calendar')).fullCalendar({
        defaultView: 'month',
        height: "auto",
        header: {
          left: '',
          center: 'title',
          right: 'prev,next today'
        },
        editable: false,
        events: this.doctorSchedules,
        eventClick: (schedule) => {
          $('#globalScheduleSelected').val(schedule.index - 1);
          $('#globalScheduleSelected').click();
          return false;
        }
      });

      var bttn = document.getElementById("globalScheduleSelected");

      bttn.onclick = () => {
        this.scheduleSelected($('#globalScheduleSelected').val());
      }
    }
  }

  clickNewSchedule() {
    this.mode = 'newSchedule';
    this.clearSchedule();
    this.getNextDoctorScheduleId();
  }

  timeConvertor(h, m, d) {
    if (d == "PM") {
      h = parseInt(h, 10) + 12;
      if (h == 24) {
        h = 0;
      }
    }
    return h + ":" + m + ":0";
  }

  inTimeSelected(h, m, d) {
    this.schedule.in_h = h;
    this.schedule.in_m = m;
    this.schedule.in_d = d;
  }

  outTimeSelected(h, m, d) {
    this.schedule.out_h = h;
    this.schedule.out_m = m;
    this.schedule.out_d = d;
  }

  clearSchedule() {
    this.schedule.iddoctor_schedule = -1;
    this.schedule.datee = "";//2012-12-30-----01/01/2015 - 01/31/2015
    this.schedule.doctor_in = "00:00:00";//23:11:22
    this.schedule.doctor_out = "00:00:00";
    this.schedule.repetive = "false";
    this.schedule.in_h = "8";
    this.schedule.in_m = "0";
    this.schedule.in_d = "AM";
    this.schedule.out_h = "10";
    this.schedule.out_m = "0";
    this.schedule.out_d = "AM";
    this.schedule.daterange = "";
  }

  showUpdateScheduleModal(schedule: any) {
    this.mode = 'editSchedule';
    (<any>$("#newSchedule")).modal();
  }

  updateSchedule() {
    if (this.schedule.repetive == 'true') {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeDoctor")).value;
    } else {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateDoctor")).value;
    }
    if (!this.schedule.daterange && this.schedule.repetive == 'true') {
      toastr.warning('Please select a date range', 'Date not selected');
    } else if (!this.schedule.daterange && this.schedule.repetive == 'false') {
      toastr.warning('Please select a date', 'Date not selected');
    } else {
      let datee = this.schedule.daterange.split("/");
      if (datee.length != 3) {
        toastr.warning('Please select a valid date', 'Date invalid');
      } else {
        this.schedule.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

        this.schedule.doctor_out = this.timeConvertor(this.schedule.out_h, this.schedule.out_m, this.schedule.out_d);
        this.schedule.doctor_in = this.timeConvertor(this.schedule.in_h, this.schedule.in_m, this.schedule.in_d);
        this.doctorService.updateDoctorSchedule(this.schedule).subscribe((data: any) => {
          (<any>$("#newSchedule")).modal('hide');
          this.getSchedules();
          this.clearSchedule();
          toastr.success("Success", "Updated schedule");
        }, (err) => {
          toastr.error('While updating schedule', 'Data update error');
        }
        );
      }
    }
  }

  deleteSchedule() {
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
          _this.doctorService.deleteDoctorSchedule(_this.schedule).subscribe((data: any) => {
            (<any>$("#newSchedule")).modal('hide');
            _this.getSchedules();
            _this.clearSchedule();
            toastr.success("Success", "Deleted schedule");
          }, (err) => {
            toastr.error('While deleting schedule', 'Data deletion error');
          }
          );
        } else {
          (<any>$("#newSchedule")).modal('hide');
        }
      });
  }

  getSchedules() {
    this.doctorSchedules = [];
    if (this.fullCalendar) {
      this.fullCalendar.fullCalendar('getCalendar').removeEvents();
    }
    this.doctorService.getAllDoctorScheduleByDoctor(this.doctor).subscribe((data: any) => {
      this.doctorSchedules = data;
      this.addIndex(this.doctorSchedules);
      if (this.fullCalendar) {
        this.fullCalendar.fullCalendar('getCalendar').removeEvents();
        this.fullCalendar.fullCalendar('getCalendar').addEventSource(this.doctorSchedules);
      }
    }, (err) => {
      toastr.error('While fetching schedules', 'Data fetch error');
    }
    );
  }

  saveSchedule() {
    if (this.schedule.repetive == 'true') {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeDoctor")).value;
    } else {
      this.schedule.daterange = (<HTMLInputElement>document.getElementById("selectDateDoctor")).value;
    }
    if (!this.schedule.daterange && this.schedule.repetive == 'true') {
      toastr.warning('Please select a date range', 'Date not selected');
    } else if (!this.schedule.daterange && this.schedule.repetive == 'false') {
      toastr.warning('Please select a date', 'Date not selected');
    } else {
      let datee = this.schedule.daterange.split("/");
      console.log(datee.length);
      if (datee.length != 3) {
        toastr.warning('Please select a valid date', 'Date invalid');
      } else {
        this.schedule.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

        this.schedule.doctor_out = this.timeConvertor(this.schedule.out_h, this.schedule.out_m, this.schedule.out_d);
        this.schedule.doctor_in = this.timeConvertor(this.schedule.in_h, this.schedule.in_m, this.schedule.in_d);
        this.doctorService.saveDoctorSchedule(this.schedule).subscribe((data: any) => {
          (<any>$("#newSchedule")).modal('hide');
          this.getSchedules();
          this.clearSchedule();
          toastr.success("Success", "Inserted schedule");
        }, (err) => {
          toastr.error('While inserting schedule', 'Data insert error');
        }
        );
      }
    }
  }

  initSelect() {
    var _this = this;

    (<any>$(".select2_demo_3")).select2({
      dropdownCssClass: 'custom-dropdown'
    });

    (<any>$(".select2_demo_3")).on('select2:open', function (e) {
      $('.custom-dropdown').parent().css('z-index', 99999);
    });

    (<any>$(".select2_demo_3")).on('select2:select', function (e) {
      _this.docSelected(e.params.data.id);
    });
  }

  docSelected(index) {
    if (index == "") {
      this.clearDoctor();
    } else {
      this.doctor.iddoctor = this.doctors[index].iddoctor;
      this.doctor.name = this.doctors[index].name;
      this.doctor.specialization = this.doctors[index].specialization;
      this.doctor.base_hospital = this.doctors[index].base_hospital;
      this.doctor.contactNo = this.doctors[index].contactNo;
      this.doctor.fee = this.doctors[index].fee;
      this.doctor.description = this.doctors[index].description;
    }

    this.initCalendar();
    this.getSchedules();
    this.clearSchedule();
  }

  initTable() {
    this.datatable = (<any>$('#editable')).DataTable({
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
        {
          defaultContent: `<button type="button" class="btn btn-xs btn-info showReportModal">
                              <span class="glyphicon glyphicon-list-alt"></span>
                          </button>
                          <button type="button" class="btn btn-xs btn-warning showUpdateModal">
                              <span class="glyphicon glyphicon-edit"></span>
                          </button>
                          `
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
          "targets": [8]
        }],
      "order": [[1, 'asc']],
      "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
      "iDisplayLength": 5,
      "fnDrawCallback": (osSettings) => {
        this.resetTableListners();
      }
    });


  }

  initDatepickers() {
    (<any>$('#selectDateDoctor')).datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: false,
      autoclose: true
    });

    (<any>$('#selectDateDoctorInvoice')).datepicker({
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      calendarWeeks: false,
      autoclose: true
    });

    (<any>$('#selectDateRangeReport')).daterangepicker();
    $('#selectDateRangeReport').on('change.datepicker', (ev) => {
      this.generateReport();
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
      else if ($(this).hasClass("showReportModal")) {
        _currClassRef.showReportModal(row.data());
      }
      else if ($(this).hasClass("showUpdateModal")) {
        _currClassRef.showUpdateModal(row.data());
      }

    })
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

  getCenterFee() {
    this.doctorService.getCenterFee().subscribe((data: any) => {
      this.doctorInvoice.center_fee = data.fee;
    }, (err) => {
      toastr.error('While fetching center fee', 'Data fetch error');
    }
    );
  }

  getNextDoctorInvoiceId(showModal: boolean) {
    this.doctorService.getNextDoctorInvoiceId().subscribe((data: any) => {
      this.doctorInvoice.iddoctor_invoice = data.iddoctor_invoice;
      if (showModal) { (<any>$("#docInvoice")).modal(); }
    }, (err) => {
      toastr.error('While fetching invoice details', 'Data fetch error');
    }
    );
  }

  getDoctrInvoiceByDoctorSchedule() {
    this.clearDoctorInvoice();
    this.doctorService.getDoctrInvoiceByDoctorSchedule(this.schedule).subscribe((data: any) => {
      if (data) {
        this.doctorInvoice.center_fee = data.center_fee;
        this.doctorInvoice.d = data.d;
        this.doctorInvoice.datee = data.datee;
        this.doctorInvoice.doc_fee = data.doc_fee;
        this.doctorInvoice.doctor_schedule_iddoctor_schedule = data.doctor_schedule_iddoctor_schedule;
        this.doctorInvoice.iddoctor_invoice = data.iddoctor_invoice;
        this.doctorInvoice.m = data.m;
        this.doctorInvoice.patient_count = data.patient_count;
        this.doctorInvoice.y = data.y;
        this.doctorInvoice.cal = this.getWebDate(data);
      }
    }, (err) => {
      toastr.error('While fetching invoice details', 'Data fetch error');
    }
    );
  }

  clickPay() {
    this.clearDoctorInvoice();
    this.mode = 'newDocInvoice';
    this.getCenterFee();
    this.doctorInvoice.doc_fee = this.doctor.fee;
    this.doctorInvoice.patient_count = this.schedulePatients.length;
    this.doctorInvoice.cal = this.schedule.daterange;
    this.getNextDoctorInvoiceId(true);
  }

  clickPaied() {
    this.mode = 'editDocInvoice';
    if (this.doctorInvoice.iddoctor_invoice != -1) {
      (<any>$("#docInvoice")).modal();
    }
  }

  saveDoctorInvoice() {
    this.doctorInvoice.cal = (<HTMLInputElement>document.getElementById("selectDateDoctorInvoice")).value;

    let datee = this.doctorInvoice.cal.split("/");
    if (datee.length != 3) {
      toastr.warning('Please select a valid date', 'Date invalid');
    } else {
      this.doctorInvoice.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

      this.doctorService.saveDoctorInvoice(this.doctorInvoice).subscribe((data: any) => {
        (<any>$("#docInvoice")).modal('hide');
        this.getDoctrInvoiceByDoctorSchedule();
        toastr.success("Success", "Invoice saved");
      }, (err) => {
        toastr.error('While saving invoice', 'Data saving error');
      }
      );
    }
  }

  deleteDoctorInvoice() {
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
          _this.doctorService.deleteDoctorInvoice(_this.doctorInvoice).subscribe((data: any) => {
            (<any>$("#docInvoice")).modal('hide');
            _this.getDoctrInvoiceByDoctorSchedule();
            toastr.success("Success", "Deleted invoice");
          }, (err) => {
            toastr.error('While deleting invoice', 'Data deletion error');
          }
          );
        } else {
          (<any>$("#docInvoice")).modal('hide');
        }
      });
  }

  updateDoctorInvoice() {

    this.doctorInvoice.cal = (<HTMLInputElement>document.getElementById("selectDateDoctorInvoice")).value;

    let datee = this.doctorInvoice.cal.split("/");
    if (datee.length != 3) {
      toastr.warning('Please select a valid date', 'Date invalid');
    } else {
      this.doctorInvoice.datee = datee[2] + "-" + datee[0] + "-" + datee[1];//yyyymmdd

      this.doctorService.updateDoctorInvoice(this.doctorInvoice).subscribe((data: any) => {
        this.getDoctrInvoiceByDoctorSchedule();
        (<any>$("#docInvoice")).modal("hide");
        toastr.success("Success", "Updated invoice details");
      }, (err) => {
        toastr.error('While updating invoice', 'Data update error');
      }
      );
    }
  }

  generateReport() {
    this.reportRequest.daterange = (<HTMLInputElement>document.getElementById("selectDateRangeReport")).value;

    let dates = this.reportRequest.daterange.split("-");
    if (dates.length != 2) {
      toastr.warning('Please select a valid date range', 'Date range invalid');
    } else {
      let from = dates[0].trim().split("/");
      let to = dates[1].trim().split("/");

      if (from.length != 3 || to.length != 3) {
        toastr.warning('Please select a valid date range', 'Date range invalid');
      } else {
        this.reportRequest.from_datee = from[2] + "-" + from[0] + "-" + from[1];//yyyymmdd
        this.reportRequest.to_datee = to[2] + "-" + to[0] + "-" + to[1];//yyyymmdd
        this.getDoctorReport();
      }
    }
  }

  getDoctorReport() {
    this.doctorService.getDoctorReport(this.reportRequest).subscribe((data: any) => {
      this.clearReportRequest();
      if (data && data.patient_count > 0) {
        this.reportRequest.center_fee = data.center_fee;
        this.reportRequest.doc_fee = data.doc_fee;
        this.reportRequest.patient_count = data.patient_count;
      }
      (<any>$("#report")).modal();
    }, (err) => {
      toastr.error('While fetching doctor report', 'Data fetch error');
    }
    );
  }
}
