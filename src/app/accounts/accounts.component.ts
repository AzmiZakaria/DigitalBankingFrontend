import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AccountService, BankAccount, AccountOperation } from '../services/account.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accountId = new FormControl('');
  currentAccount: BankAccount | null = null;
  operations: AccountOperation[] = [];
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for accountId in query params
    this.route.queryParams.subscribe(params => {
      const accountId = params['accountId'];
      if (accountId) {
        this.accountId.setValue(accountId);
        this.searchAccount();
      }
    });
  }

  // Make searchAccount public so it can be called after navigation
  public searchAccount() {
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
