import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
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

  // دالة مساعدة للحفظ والتحديث الفوري
  private saveAndSync(items: any[]): void {
    localStorage.setItem('localCart', JSON.stringify(items));
    this.cartItems.set([...items]);
  }

  // زيادة الكمية داخل صفحة السلة باستخدام الـ ID
  increaseQuantity(productId: any): void {
    const items = [...this.cartItems()];
    const item = items.find((p: any) => p.id === productId || p.product?.id === productId);

    if (item) {
      item.quantity = (Number(item.quantity) || 1) + 1;
      this.saveAndSync(items);
    }
  }

  // تقليل الكمية داخل صفحة السلة
  decreaseQuantity(productId: any): void {
    const items = [...this.cartItems()];
    const item = items.find((p: any) => p.id === productId || p.product?.id === productId);

    if (item) {
      const currentQty = Number(item.quantity) || 1;
      if (currentQty > 1) {
        item.quantity = currentQty - 1;
        this.saveAndSync(items);
      }
    }
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

  // حساب إجمالي عدد القطع ديناميكياً
  totalQuantity = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  });

  // حساب السعر الإجمالي (Subtotal)
  subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => {
      // التعامل مع هيكل السعر سواء كان داخل product أو مباشر
      const price = Number(item.price || item.product?.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
  });
}
