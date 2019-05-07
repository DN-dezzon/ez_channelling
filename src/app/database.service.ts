import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  apiUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  query(query: string){
    return this.httpClient.post(this.apiUrl + '/query', {query:query} );
  }

  getPatients(){
    return this.httpClient.get(this.apiUrl + '/getPatients');
  }
}
