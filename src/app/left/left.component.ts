import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  user = {
    iduser: "",
    name: "",
    designation: "",
    type: "",
  };

  constructor(private databaseService : DatabaseService) { }

  private previousEl = "#homeNav";

  ngOnInit() {
    this.user.iduser = this.databaseService.user.iduser;
    this.user.name = this.databaseService.user.name;
    this.user.designation = this.databaseService.user.designation;
    this.user.type = this.databaseService.user.type;
  }

  clickLink(el){
    if(this.previousEl){
      $(this.previousEl).removeClass("active");
    }
    $(el).addClass("active");
    this.previousEl = el;
  }
}
