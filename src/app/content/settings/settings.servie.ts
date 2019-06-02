import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient) {}

  updateCenterFee(center : any){
    return this.httpClient.post(environment.apiUrl + '/updateCenterFee',center);
  }

  getCenterFee(){
    return this.httpClient.get(environment.apiUrl + '/getChannellingFee');
  }

  updateUser(user : any){
    return this.httpClient.post(environment.apiUrl + '/updateUser',user);
  }

  getUserDetails(user:any){
    return this.httpClient.post(environment.apiUrl + '/getUserdata',user);
  }

}
