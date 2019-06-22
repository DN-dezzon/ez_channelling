import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChannellingServie {

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
  getPatientbyMobile(pid : any){
    return this.httpClient.get(environment.apiUrl + '/getPatientbyMobile',pid);
  }
 
  searchAppointment(searchAppointment : any){
    return this.httpClient.post(environment.apiUrl + '/searchAppointment',searchAppointment);
  }
  getPatientByContactNo(patient:any){
    return this.httpClient.post(environment.apiUrl + '/getPatientByContactNo',patient);
  }
  getDoctorById(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getDoctortbyId',doctor);
  }
  getAppointMentNumber(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getAppointMentNumber',doctor);
  }
  getScheduleIdId(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getScheduleIdId',doctor);
  }
  saveAppointment(appointment:any){
    
    return this.httpClient.post(environment.apiUrl + '/saveAppointment',appointment);
  } 

  makePayment(appointment:any){
    
    return this.httpClient.post(environment.apiUrl + '/makePayment',appointment);
  } 
  getTodaySchedule(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getTodaySchedule',doctor);
  }
  getPatientCount(doctor : any){ 
    return this.httpClient.post(environment.apiUrl + '/getTodaySchedule',doctor);
  } 
  getPatientIncome(){
    return this.httpClient.get(environment.apiUrl + '/getPatientIncome');
  }
  getPatientIncomeMonthly(){
    return this.httpClient.get(environment.apiUrl + '/getPatientIncomeMonthly');
  }
  getAllDoctorScheduleByDoctor(doctor : any){
    return this.httpClient.post(environment.apiUrl + '/getAllDoctorScheduleByDoctor', doctor);
  }
}
