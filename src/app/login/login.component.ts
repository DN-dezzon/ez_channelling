import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { DatabaseService } from '../database.service';
import { userInfo } from 'os';

declare let toastr: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {
    iduser: "",
    name: "",
    designation: "",
    type: "",
    uname: "",
    passwd: "",
  };

  constructor(private router: Router, private loginServeice: LoginService, private databaseService: DatabaseService) { }

  ngOnInit() {
    document.body.className = 'gray-bg';
  }

  ngAfterViewInit() {
    this.initToasterNotifications();
    this.clearUser();
  }

  clearUser() {
    this.user.iduser = "";
    this.user.name = "";
    this.user.designation = "";
    this.user.type = "";
    this.user.uname = "";
    this.user.passwd = "";
  }


  submit() {
    this.loginServeice.getUser(this.user).subscribe((data: any) => {
      if (data && data.length && this.user.uname == data[0].uname && this.user.passwd == data[0].passwd) {
        this.user.iduser = data[0].iduser;
        this.user.designation = data[0].designation;
        this.user.type = data[0].type;
        this.user.name = data[0].name;
        this.databaseService.user.iduser = this.user.iduser;
        this.databaseService.user.name = this.user.name;
        this.databaseService.user.designation = this.user.designation;
        this.databaseService.user.type = this.user.type;
        this.router.navigateByUrl('/home/home');
        toastr.clear();
        toastr.info("Have a nice day :)", "Welcome " + this.user.name);
      } else {
        toastr.error("Username and password mismatch", "Login failed");
        this.clearUser();
      }
    }, (err) => {
      toastr.error('Cannot connect to database', 'Data fetch error');
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
