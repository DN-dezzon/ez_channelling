import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-content',
  template: '<router-outlet></router-outlet>',
})

export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

