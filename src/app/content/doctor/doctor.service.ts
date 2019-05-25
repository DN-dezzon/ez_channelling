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

  getNextDoctorId(){
    return this.httpClient.get(environment.apiUrl + '/getNextDoctorId');
  }

  getAllDoctorScheduleByDoctor(doctor : any){
    return this.httpClient.post(environment.apiUrl + '/getAllDoctorScheduleByDoctor', doctor);
  }

  saveDoctorSchedule(doctorSchedule : any){
    return this.httpClient.post(environment.apiUrl + '/saveDoctorSchedule',doctorSchedule);
  } 
  
  updateDoctorSchedule(doctorSchedule : any){
    return this.httpClient.post(environment.apiUrl + '/updateDoctorSchedule',doctorSchedule);
  }

  deleteDoctorSchedule(doctorSchedule : any){
    return this.httpClient.post(environment.apiUrl + '/deleteDoctorSchedule',doctorSchedule);
  }

  getNextDoctorScheduleId(){
    return this.httpClient.get(environment.apiUrl + '/getNextDoctorScheduleId');
  }

  getPatientsBySchedule(doctorSchedule : any){
    return this.httpClient.post(environment.apiUrl + '/getPatientsBySchedule',doctorSchedule);
  }
}
