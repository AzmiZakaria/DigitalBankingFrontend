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

export interface DebitDTO {
  accountId: string;
  amount: number;
  description: string;
}

export interface CreditDTO {
  accountId: string;
  amount: number;
  description: string;
}

export interface TransferDTO {
  accountSource: string;
  accountDestination: string;
  amount: number;
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
    debit(debitDTO: DebitDTO): Observable<DebitDTO> {
    return this.http.post<DebitDTO>(`${this.backendUrl}/accounts/debit`, debitDTO);
  }

  credit(creditDTO: CreditDTO): Observable<CreditDTO> {
    return this.http.post<CreditDTO>(`${this.backendUrl}/accounts/credit`, creditDTO);
  }

  transfer(transferDTO: TransferDTO): Observable<void> {
    return this.http.post<void>(`${this.backendUrl}/accounts/transfer`, transferDTO);
  }
}