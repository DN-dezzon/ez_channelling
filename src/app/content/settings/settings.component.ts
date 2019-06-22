import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from './settings.servie';
import { DatabaseService } from 'src/app/database.service';
import { Router } from '@angular/router';


declare let toastr: any;
declare var $: any;
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [DatePipe],

})


export class SettingsComponent implements OnInit {
  elementRef: ElementRef;
  datatable: any;
  centers: any[];
  userdata: any[];
  fullCalendar: any;
  doctorSchedules: any[];

  mode = "new";

  user = {
    iduser: "",
    name: "",
    designation: "",
    type: "",
    passwd: ""
  };

  center = {
    fee: ""
  };

  printer = {
    name: "",
  };


  myDate = new Date();
  constructor(private router: Router, private settingsService: SettingsService, private datePipe: DatePipe, private databaseService: DatabaseService) {

  }

  ngOnInit() {
    this.user.name = this.databaseService.user.name;
    this.user.iduser = this.databaseService.user.iduser;
    this.getCenterFee();
    this.initToasterNotifications();
    this.getUserdata();
    this.getPrinterName();
  }
  updateFee() {
    this.settingsService.updateCenterFee(this.center).subscribe((data: any) => {
      this.getCenterFee();
      toastr.success('Success', 'Center fee updated');
    }, (err) => {
      console.log(err);
      toastr.error('While updating center fee', 'Data update error');
    }
    );
  }

  updatePrinterName() {
    this.settingsService.updatePrinterName(this.printer).subscribe((data: any) => {
      this.getPrinterName();
      toastr.success('Success', 'Printer name updated');
    }, (err) => {
      console.log(err);
      toastr.error('While updating printer name', 'Data update error');
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
  // Load fee 
  getCenterFee() {
    this.settingsService.getCenterFee().subscribe((data: any) => {
      this.center.fee = data.fee;
    }, (err) => {
      console.log(err);
      toastr.error('While fetching center fee', 'Data fetch error');
    }
    );
  }


  getPrinterName() {
    this.settingsService.getPrinterName().subscribe((data: any) => {
      this.printer.name = data.name;
    }, (err) => {
      console.log(err);
      toastr.error('While fetching printer name', 'Data fetch error');
    }
    );
  }


  updateuser() {
    this.settingsService.updateUser(this.user).subscribe((data: any) => {
      this.getUserdata();
      toastr.success('Success', 'User details updated');
      this.router.navigateByUrl('/login');
      toastr.info('to apply the changes', 'Please login again');
    }, (err) => {
      console.log(err);
      toastr.error('While updating user details', 'Data update error');
    }
    );
  }
  getUserdata() {
    this.settingsService.getUserDetails(this.user).subscribe((data: any) => {
      this.userdata = data;
      for (let index = 0; index < this.userdata.length; index++) {

        this.user.name = this.userdata[index].name;
        this.user.passwd = this.userdata[index].passwd;
      }


    }, (err) => {
      console.log(err);
      toastr.error('While fetching user details', 'Data fetch error');
    }
    );
  }
}
