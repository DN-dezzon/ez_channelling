import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.scss']
})
export class UnregisteredComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.className = 'gray-bg';
  }

}
