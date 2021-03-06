import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpClient: HttpClient) { }

  getDoctors() {
    return this.httpClient.get(environment.apiUrl + '/getDoctors');
  }

  saveDoctor(doctor: any) {
    return this.httpClient.post(environment.apiUrl + '/saveDoctor', doctor);
  }

  updateDoctor(doctor: any) {
    return this.httpClient.post(environment.apiUrl + '/updateDoctor', doctor);
  }

  deleteDoctor(doctor: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteDoctor', doctor);
  }

  getNextDoctorId() {
    return this.httpClient.get(environment.apiUrl + '/getNextDoctorId');
  }

  getAllDoctorScheduleByDoctor(doctor: any) {
    return this.httpClient.post(environment.apiUrl + '/getAllDoctorScheduleByDoctor', doctor);
  }

  saveDoctorSchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/saveDoctorSchedule', doctorSchedule);
  }

  updateDoctorSchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/updateDoctorSchedule', doctorSchedule);
  }

  deleteDoctorSchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteDoctorSchedule', doctorSchedule);
  }

  getNextDoctorScheduleId() {
    return this.httpClient.get(environment.apiUrl + '/getNextDoctorScheduleId');
  }

  getPatientsBySchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/getPatientsBySchedule', doctorSchedule);
  }

  getCenterFee() {
    return this.httpClient.get(environment.apiUrl + '/getChannellingFee');
  }

  getNextDoctorInvoiceId() {
    return this.httpClient.get(environment.apiUrl + '/getNextDoctorInvoiceId');
  }

  updateDoctorInvoice(doctorInvoice: any) {
    return this.httpClient.post(environment.apiUrl + '/updateDoctorInvoice', doctorInvoice);
  }

  getDoctrInvoiceByDoctorSchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/getDoctrInvoiceByDoctorSchedule', doctorSchedule);
  }

  saveDoctorInvoice(doctorInvoice: any) {
    return this.httpClient.post(environment.apiUrl + '/saveDoctorInvoice', doctorInvoice);
  }

  deleteDoctorInvoice(doctorInvoice: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteDoctorInvoice', doctorInvoice);
  }

  getDoctorReport(reportRequest: any){
    return this.httpClient.post(environment.apiUrl + '/getDoctorReport', reportRequest);
  }
  printPatient_report(transaction:any){
    
    return this.httpClient.post(environment.apiUrl + '/printPatient_report',transaction);
  } 
  printInvoice(doctorInvoice:any){
    return this.httpClient.post(environment.apiUrl + '/printDoctorInvoice',doctorInvoice);
  }

  getPendingPatientCountBySchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/getPendingPatientCountBySchedule', doctorSchedule);
  }

  isDoctorDeletable(doctor: any) {
    return this.httpClient.post(environment.apiUrl + '/isDoctorDeletable', doctor);
  }

  isDoctorScheduleDeletable(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/isDoctorScheduleDeletable', doctorSchedule);
  }

  getCancelledPatientCountBySchedule(doctorSchedule: any) {
    return this.httpClient.post(environment.apiUrl + '/getCancelledPatientCountBySchedule', doctorSchedule);
  }
}
