import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  constructor() { }

  private previousEl = "";

  ngOnInit() {
  }

  clickLink(el){
    if(this.previousEl){
      $(this.previousEl).removeClass("active");
    }
    $(el).addClass("active");
    this.previousEl = el;
  }
}
