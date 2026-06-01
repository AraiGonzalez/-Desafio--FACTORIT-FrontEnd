import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/cart.model';
import { CardModule }       from 'primeng/card';
import { ButtonModule }     from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule }      from 'primeng/table';
import { TagModule }        from 'primeng/tag';
import { ToastModule }      from 'primeng/toast';
import { DividerModule }    from 'primeng/divider';
import { MessageService }   from 'primeng/api';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ CommonModule, FormsModule,
    CardModule, ButtonModule, InputNumberModule,
    TableModule, TagModule, ToastModule, DividerModule],
  templateUrl: './customers.component.html',
  providers: [MessageService],
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  allCustomers:     Customer[] = [];
  vipCustomers:     Customer[] = [];
  newVipCustomers:  Customer[] = [];
  lostVipCustomers: Customer[] = [];

  filterYear    = new Date().getFullYear();
  filterMonth   = new Date().getMonth() + 1;
  filterQueried = false;

  allColumns = ['id', 'name', 'email', 'status'];
  vipColumns = ['name', 'email'];

  constructor(
    private customerService: CustomerService,
    private messageService:  MessageService
  ) {}

  ngOnInit(): void { this.loadAll(); this.loadVip(); }

  loadAll(): void { this.customerService.getAll().subscribe(c => this.allCustomers = c); }
  loadVip(): void { this.customerService.getVipCustomers().subscribe(c => this.vipCustomers = c); }

  loadNewVip(): void {
    this.filterQueried = true;
    this.customerService.getNewVipInMonth(this.filterYear, this.filterMonth)
      .subscribe(c => {
        this.newVipCustomers = c;
        this.messageService.add({ severity: 'success', summary: 'OK',
          detail: `${c.length} cliente(s) ganaron VIP en ${this.filterMonth}/${this.filterYear}`, life: 3000 });
      });
  }

  loadLostVip(): void {
    this.filterQueried = true;
    this.customerService.getLostVipInMonth(this.filterYear, this.filterMonth)
      .subscribe(c => {
        this.lostVipCustomers = c;
        this.messageService.add({ severity: 'warn', summary: 'OK',
          detail: `${c.length} cliente(s) perdieron VIP en ${this.filterMonth}/${this.filterYear}`, life: 3000 });
      });
  }

  recalculate(): void {
    this.customerService.recalculateVip(this.filterYear, this.filterMonth).subscribe(() => {
      this.loadAll(); this.loadVip();
      if (this.filterQueried) { this.loadNewVip(); this.loadLostVip(); }
      this.messageService.add({ severity: 'success', summary: 'OK', detail: 'Estado VIP recalculado', life: 3000 });
    });
  }
}