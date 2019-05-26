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
  private datatable: any;
  private centers: any[];
  private userdata: any[];
  fullCalendar: any;
  doctorSchedules: any[];

  private mode = "new";

  user = {
    iduser: "",
    name: "",
    designation: "",
    type: "",
    passwd: ""
  };

  private center = {
    fee: ""
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
  }
  updateFee() {
    this.settingsService.updateCenterFee(this.center).subscribe((data: any) => {
      this.getCenterFee();
      toastr.success('Success', 'Fee updated');
    }, (err) => {
      console.log(err);
      toastr.error('While fetching doctor details', 'Data fetch error');
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
    }
    );
  }

  updateuser() {

    this.settingsService.updateUser(this.user).subscribe((data: any) => {
      this.getUserdata();
      toastr.success('Success', 'User details updated.');
      this.router.navigateByUrl('/login');
    }, (err) => {
      console.log(err);
      toastr.error('While fetching doctor details', 'Data fetch error');
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
    }
    );
  }
}
