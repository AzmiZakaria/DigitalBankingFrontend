import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustumerService, Customer } from '../../services/custumer.service';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {
  customerId!: number;
  customerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustumerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCustomer();
  }

  loadCustomer() {
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {
        this.customerForm = this.fb.group({
          name: [customer.name, Validators.required],
          email: [customer.email, [Validators.required, Validators.email]]
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading customer: ' + error.message;
        console.error('Error loading customer:', error);
      }
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const updatedCustomer: Customer = {
        id: this.customerId,
        ...this.customerForm.value
      };

      this.customerService.updateCustomer(this.customerId, updatedCustomer).subscribe({
        next: () => {
          this.router.navigate(['/customers'], {
            state: { successMessage: 'Customer updated successfully' }
          });
        },
        error: (error) => {
          this.errorMessage = 'Error updating customer: ' + error.message;
          console.error('Error updating customer:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/customers']);
  }
}
