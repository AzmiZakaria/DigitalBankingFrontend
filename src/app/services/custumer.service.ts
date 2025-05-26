import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface CustomerForm {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustumerService {
  private backendUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.backendUrl}/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.backendUrl}/customers/${id}`);
  }

  saveCustomer(customer: CustomerForm): Observable<Customer> {
    return this.http.post<Customer>(`${this.backendUrl}/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.backendUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/customers/${id}`);
  }
}
