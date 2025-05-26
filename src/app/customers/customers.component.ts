import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustumerService, Customer } from '../services/custumer.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  errorMessage: string = '';
  service=inject(CustumerService);

  constructor(private customerService: CustumerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.service.getCustomers().subscribe({
      next: (data) => {
        this.customers = data as Customer[];
        console.log('Customers loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Error loading customers: ' + err.message;
      }
    });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting customer: ' + err.message;
        }
      });
    }
  }
}
