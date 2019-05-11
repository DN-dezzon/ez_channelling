import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) {}

  getPatients(){
    return this.httpClient.get(environment.apiUrl + '/getPatients');
  }

  savePatient(patient : any){
    return this.httpClient.post(environment.apiUrl + '/savePatient',patient);
  } 
  
  updatePatient(patient : any){
    return this.httpClient.post(environment.apiUrl + '/updatePatient',patient);
  }

  deletePatient(patient : any){
    return this.httpClient.post(environment.apiUrl + '/deletePatient',patient);
  }
  getPatientHistory(patient: any){ 
    return this.httpClient.get(environment.apiUrl + '/getPatientHistory',patient);
  }
}
