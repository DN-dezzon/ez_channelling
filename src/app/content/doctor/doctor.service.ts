import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpClient: HttpClient) {}

  getDoctors(){
    return this.httpClient.get(environment.apiUrl + '/getDoctors');
  }

  saveDoctor(doctor : any){
    return this.httpClient.post(environment.apiUrl + '/saveDoctor',doctor);
  } 
  
  updateDoctor(doctor : any){
    return this.httpClient.post(environment.apiUrl + '/updateDoctor',doctor);
  }

  deleteDoctor(doctor : any){
    return this.httpClient.post(environment.apiUrl + '/deleteDoctor',doctor);
  }
}
