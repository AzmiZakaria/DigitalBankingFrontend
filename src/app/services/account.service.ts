import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankAccount {
    id:            string;
    balance:       number;
    createdAt:     Date;
    status:        null;
    customerDTO:   CustomerDTO;
    type:          string;
    overDraft?:    number;
    interestRate?: number;
}

export interface CustomerDTO {
    id:    number;
    name:  string;
    email: string;
}

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  type: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private backendUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.backendUrl}/accounts`);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.backendUrl}/accounts/${id}`);
  }

  getAccountOperations(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.backendUrl}/accounts/${accountId}/operations`);
  }
}