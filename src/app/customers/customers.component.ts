import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustumerService, Customer } from '../services/custumer.service';
import { RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  service = inject(CustumerService);
  searchControl = new FormControl('');

  constructor(
    private customerService: CustumerService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['successMessage']) {
      this.successMessage = navigation.extras.state['successMessage'];
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if (keyword) {
        this.searchCustomers(keyword);
      } else {
        this.loadCustomers();
      }
    });
  }

  searchCustomers(keyword: string) {
    this.service.searchCustomers(keyword).subscribe({
      next: (data) => {
        this.customers = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Error searching customers: ' + err.message;
        console.error('Search error:', err);
      }
    });
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
      this.service.deleteCustomer(id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== id);
          this.errorMessage = '';
          this.successMessage = 'Customer deleted successfully';
          setTimeout(() => this.successMessage = '', 3000); 
        },
        error: (err) => {
          this.errorMessage = 'Error deleting customer: ' + err.message;
          this.successMessage = '';
          console.error('Delete error:', err);
        }
      });
    }
  }
}
