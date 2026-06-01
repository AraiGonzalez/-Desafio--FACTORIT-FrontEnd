import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ToolbarModule, ButtonModule],
  template: `
    <p-toolbar styleClass="border-noround border-bottom-1 border-primary-200 px-4 navbar-sticky">
      <ng-template #start>
        <span class="text-xl font-bold" style="color:var(--gold)">
          <i class="pi pi-shopping-cart mr-2"></i>Cart·Shop
        </span>
      </ng-template>
      <ng-template #end>
        <div class="flex gap-2">
          <a routerLink="/cart" routerLinkActive="p-button-outlined">
            <p-button label="Carrito" icon="pi pi-shopping-bag" [text]="true" size="small"/>
          </a>
          <a routerLink="/customers" routerLinkActive="p-button-outlined">
            <p-button label="Clientes VIP" icon="pi pi-star" [text]="true" size="small"/>
          </a>
          
        </div>
      </ng-template>
    </p-toolbar>
  `,
  styles: [`
    .navbar-sticky {
      position: sticky !important;
      top: 0;
      z-index: 100;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {}

