import { Component, OnInit } from '@angular/core';
import { CartStatus, Customer, Product} from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule }   from 'primeng/button';
import { CardModule }     from 'primeng/card';
import { SelectModule }   from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule }    from 'primeng/table';
import { ToastModule }    from 'primeng/toast';
import { DividerModule }  from 'primeng/divider';
import { TagModule }      from 'primeng/tag';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule,
    ButtonModule, CardModule, SelectModule,
    InputTextModule, InputNumberModule,
    TableModule, ToastModule, DividerModule, TagModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {

  customers: Customer[] = [];
  products:  Product[]  = [];
  currentCart: CartStatus | null = null;

  selectedCustomer: Customer | null = null;
  selectedProduct:  Product  | null = null;
  quantity     = 1;
  simulatedDate = '';

  constructor(
    private cartService:     CartService,
    private productService:  ProductService,
    private customerService: CustomerService,
    private messageService:  MessageService
  ) {}

  ngOnInit(): void {
    this.customerService.getAll().subscribe(c => this.customers = c);
    this.productService.getAll().subscribe(p => this.products = p);
  }

  createCart(): void {
    if (!this.selectedCustomer) return;
    this.cartService.createCart(
      this.selectedCustomer.id,
      this.simulatedDate || undefined
    ).subscribe({
      next: (cart) => {
        this.notify('success', `Carrito #${cart.id} creado — ${this.typeLabel(cart.type)}`);
        this.refreshCart(cart.id);
      },
      error: () => this.notify('error', 'Error al crear el carrito')
    });
  }

  addProduct(): void {
    if (!this.currentCart || !this.selectedProduct) return;
    this.cartService.addProduct(this.currentCart.cartId, this.selectedProduct.id, this.quantity)
      .subscribe({
        next: (c) => { this.notify('success', 'Producto agregado'); this.refreshCart(c.id); },
        error: () => this.notify('error', 'Error al agregar producto')
      });
  }

  addOneUnit(productId: number): void {
    if (!this.currentCart) return;
    this.cartService.addProduct(this.currentCart.cartId, productId, 1)
      .subscribe({ next: (c) => this.refreshCart(c.id) });
  }

  removeOneUnit(productId: number): void {
    if (!this.currentCart) return;
    this.cartService.removeProduct(this.currentCart.cartId, productId, 1)
      .subscribe({ next: (c) => this.refreshCart(c.id) });
  }

  removeProduct(productId: number): void {
    if (!this.currentCart) return;
    const item = this.currentCart.items.find(i => i.product.id === productId);
    if (!item) return;
    this.cartService.removeProduct(this.currentCart.cartId, productId, item.quantity)
      .subscribe({ next: (c) => { this.notify('success', 'Producto eliminado'); this.refreshCart(c.id); } });
  }

  checkout(): void {
    if (!this.currentCart) return;
    this.cartService.checkout(this.currentCart.cartId).subscribe({
      next: () => { this.notify('success', 'Compra finalizada con éxito'); this.currentCart = null; },
      error: () => this.notify('error', 'Error al finalizar la compra')
    });
  }

  deleteCart(): void {
    if (!this.currentCart) return;
    this.cartService.deleteCart(this.currentCart.cartId).subscribe({
      next: () => { this.notify('success', 'Carrito eliminado'); this.currentCart = null; },
      error: () => this.notify('error', 'Error al eliminar el carrito')
    });
  }

  private refreshCart(cartId: number): void {
    this.cartService.getCartStatus(cartId).subscribe(c => this.currentCart = c);
  }

  private notify(severity: 'success' | 'error', detail: string): void {
    this.messageService.add({ severity, summary: severity === 'success' ? 'OK' : 'Error', detail, life: 3000 });
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      COMMON: '🛒 Común', SPECIAL_DATE: '📅 Fecha Especial', VIP: '⭐ VIP'
    };
    return map[type] ?? type;
  }

  typeSeverity(type: string): 'warn' | 'info' | 'success' {
    return type === 'VIP' ? 'warn' : type === 'SPECIAL_DATE' ? 'info' : 'success';
  }
}