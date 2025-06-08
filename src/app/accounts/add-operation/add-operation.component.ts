import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-operation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-operation.component.html',
  styleUrl: './add-operation.component.css'
})
export class AddOperationComponent implements OnInit {
  operationForm!: FormGroup;
  accountId: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.params['id'];
    this.initializeForm();
  }

  private initializeForm() {
    this.operationForm = this.fb.group({
      operationType: ['CREDIT', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      destinationAccount: ['']
    });

    // Listen to operation type changes to handle destination account field
    this.operationForm.get('operationType')?.valueChanges.subscribe(type => {
      const destinationControl = this.operationForm.get('destinationAccount');
      if (type === 'TRANSFER') {
        destinationControl?.setValidators([Validators.required]);
      } else {
        destinationControl?.clearValidators();
      }
      destinationControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.operationForm.valid) {
      const formData = this.operationForm.value;
      
      switch (formData.operationType) {
        case 'DEBIT':
          this.accountService.debit({
            accountId: this.accountId,
            amount: formData.amount,
            description: formData.description
          }).subscribe(this.handleResponse());
          break;

        case 'CREDIT':
          this.accountService.credit({
            accountId: this.accountId,
            amount: formData.amount,
            description: formData.description
          }).subscribe(this.handleResponse());
          break;

        case 'TRANSFER':
          this.accountService.transfer({
            accountSource: this.accountId,
            accountDestination: formData.destinationAccount,
            amount: formData.amount
          }).subscribe(this.handleResponse());
          break;
      }
    }
  }

  private handleResponse() {
    return {
      next: () => {
        this.successMessage = 'Operation completed successfully';
        // Navigate back to accounts page with the account ID as query parameter
        setTimeout(() => {
          this.router.navigate(['/accounts'], { 
            queryParams: { accountId: this.accountId },
            queryParamsHandling: 'merge'
          });
        }, 1500);
      },
      error: (err: any) => {
        this.errorMessage = 'Error performing operation: ' + err.message;
      }
    };
  }

  get showDestinationAccount() {
    return this.operationForm.get('operationType')?.value === 'TRANSFER';
  }
}
