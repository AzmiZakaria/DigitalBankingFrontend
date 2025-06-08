import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService, BankAccount, AccountOperation } from '../services/account.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  accountId = new FormControl('');
  currentAccount: BankAccount | null = null;
  operations: AccountOperation[] = [];
  errorMessage: string = '';

  constructor(private accountService: AccountService) {}

  searchAccount() {
    if (!this.accountId.value) {
      this.errorMessage = 'Please enter an account ID';
      return;
    }

    this.accountService.getAccount(this.accountId.value).subscribe({
      next: (account) => {
        this.currentAccount = account;
        this.errorMessage = '';
        this.loadOperations();
      },
      error: (err) => {
        this.errorMessage = 'Error loading account: ' + err.message;
        this.currentAccount = null;
        this.operations = [];
      }
    });
  }

  private loadOperations() {
    if (!this.currentAccount) return;
    
    this.accountService.getAccountOperations(this.currentAccount.id).subscribe({
      next: (operations) => {
        this.operations = operations;
      },
      error: (err) => {
        this.errorMessage = 'Error loading operations: ' + err.message;
      }
    });
  }
}
