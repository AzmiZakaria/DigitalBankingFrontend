import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustumerService, CustomerForm } from '../../services/custumer.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  customerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustumerService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData: CustomerForm = this.customerForm.value;
      this.customerService.saveCustomer(customerData).subscribe({
        next: () => {
          this.router.navigate(['/customers'], { 
            state: { successMessage: 'Customer added successfully' }
          });
        },
        error: (error) => {
          this.errorMessage = 'Error adding customer: ' + error.message;
          console.error('Error adding customer:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/customers']);
  }
}
