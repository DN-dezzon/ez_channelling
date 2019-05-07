import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  apiUrl = 'http://localhost:8080/query';

  constructor(private httpClient: HttpClient) {}

  query(query: string){
    return this.httpClient.post(this.apiUrl , {query:query} );
  }
}
