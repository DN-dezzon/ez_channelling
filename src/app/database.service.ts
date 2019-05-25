import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  user = {
    iduser: "",
    name: "",
    designation: "",
    type: "",
    user:""
  };

  constructor(private httpClient: HttpClient) {}

  query(query: string){
    return this.httpClient.post(environment.apiUrl + '/query', {query:query} );
  }

  getPatients(){
    return this.httpClient.get(environment.apiUrl + '/getPatients');
  }
}
