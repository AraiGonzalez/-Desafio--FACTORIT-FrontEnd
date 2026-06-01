import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CustomersComponent } from './components/customers/customers.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component')
      .then(m => m.CartComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component')
      .then(m => m.CustomersComponent)
  },
 
];