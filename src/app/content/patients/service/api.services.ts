import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'src/environments/environment.prod';
import { ENDPOINTS } from './api.endpoints';

@Injectable()
export class PatientApiService {

  constructor(private httpClient: HttpClient) {
  }

  getPatients() {
    const url = appConfig.appRoot + ENDPOINTS.patients;
    return this.httpClient.get(url);
  }
}
