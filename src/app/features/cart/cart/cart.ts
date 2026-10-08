import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Scart } from '../../../core/services/scart';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private scart = inject(Scart);
  private pLATFORM_ID = inject(PLATFORM_ID);
  cartItems = signal<any[]>([]);
  cartId = signal<string[]>([]);

  ngOnInit(): void {
    // get
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.addToItemsCart();
    }
  }
  //  get
  addToItemsCart(): void {
    const savedCart = localStorage.getItem('localCart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }

    const items = this.cartItems();

    this.cartId.set(items.map((item) => item.cart_id));

    console.log(this.cartItems());
    console.log(this.cartId());
  }

  removeItem(productId: number) {
    let currentItems = this.cartItems();

    // بنصفى المنتجات ونشيل المنتج اللي الـ id بتاعه مطابق
    currentItems = currentItems.filter(
      (item: any) => item.product?.id !== productId && item.id !== productId,
    );

    // نحدث الـ LocalStorage والـ Signal
    localStorage.setItem('localCart', JSON.stringify(currentItems));
    this.cartItems.set(currentItems);
  }
}
