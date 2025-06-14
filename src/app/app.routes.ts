import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { AccountsComponent } from './accounts/accounts.component';
import { EditCustomerComponent } from './customers/edit-customer/edit-customer.component';
import { AddOperationComponent } from './accounts/add-operation/add-operation.component';

export const routes: Routes = [
    { path: "customers", component: CustomersComponent },
    { path: "customers/add", component: AddCustomerComponent },
    { path: "customers/edit/:id", component: EditCustomerComponent },
    { path: 'accounts', component: AccountsComponent },
    {path: 'accounts/:id/operations/new',component: AddOperationComponent}
];
