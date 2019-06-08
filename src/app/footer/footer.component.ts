import { Component, OnInit } from '@angular/core';
import { company, product, medicalCenter } from 'src/environments/environment.prod';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  company : any;
  product : any;
  medicalCenter :any;
  constructor() {
    this.company = company;
    this.product = product;
    this.medicalCenter = medicalCenter;
   }

  ngOnInit() {
  }


}
