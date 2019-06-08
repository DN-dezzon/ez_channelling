import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private httpClient: HttpClient) {}

  getTransactions(transactionsRequest:any){
    return this.httpClient.post(environment.apiUrl + '/getTransactions',transactionsRequest);
  }
  
  deleteTransaction(transaction: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteTransaction', transaction);
  }
}
