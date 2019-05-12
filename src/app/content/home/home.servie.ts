import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) {}

  getDoctors(){
    return this.httpClient.get(environment.apiUrl + '/getDoctors');
  }
 getPatients(){
    return this.httpClient.get(environment.apiUrl + '/getPatients');
  }
  getPatientById(pid : any){
    return this.httpClient.get(environment.apiUrl + '/getPatientbyId',pid);
  }
  getDoctorById(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getDoctortbyId',doctor);
  }
  getAppointMentNumber(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getAppointMentNumber',doctor);
  }
  saveAppointment(patient:any, doctor : any){
    alert(patient.idpatient+" "+ doctor.iddoctor);
    return this.httpClient.post(environment.apiUrl + '/saveAppointment',patient,doctor);
  } 
}
