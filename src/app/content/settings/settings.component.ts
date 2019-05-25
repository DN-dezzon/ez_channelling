import { Component, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from './settings.servie';


declare var $: any;
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [DatePipe],

})
export class SettingsComponent implements OnInit {
  elementRef: ElementRef;
  private datatable: any;
  private doctors: any[];
  private doctor_appointments: any[];
  private todaySchedule: any[];
  private OptionsSelect: -1;
  private patients: any[];
  private patient_data: any[];
  private doctor_data: any[];

  fullCalendar: any;
  doctorSchedules: any[];

  private mode = "";
  private doctor = {
    doctor_iddoctor: "",
    iddoctor_schedule: "",
    iddoctor: -1,
    name: "",
    specialization: "",
    base_hospital: "",
    contactNo: "",
    fee: 0.0,
    description: "",
    datee: "",
    number: "",
    timee: "",
    tablelength: "",
    totalAppointment: "",
    todayPatientVisits: 0
  };

  private patient = {
    idpatient: -1,
    name: "",
    contactNo: "",
    amount: "",
    monthly_income: ""
  };
  myDate = new Date();
  constructor(private settingsService: SettingsService, private datePipe: DatePipe) {

  }

  ngOnInit() {
  }

}
