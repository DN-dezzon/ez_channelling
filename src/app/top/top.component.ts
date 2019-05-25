import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  navBarAction(){
    if(document.body.classList.contains('mini-navbar')){
      document.body.classList.remove('mini-navbar');
    }else{
      document.body.classList.add('mini-navbar');
    }
  }
}
