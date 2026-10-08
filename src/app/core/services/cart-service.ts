import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  // بنعمل Subject عشان نراقب هل السلة اتحدثت ولا لأ
  private cartUpdatedSource = new BehaviorSubject<void>(undefined);
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  // جلب محتويات السلة (GET)
  getCart() {
    return this.http.get(environment.baseUrl + '/api/v1/cart');
  }

  // إضافة منتج للسلة (POST)
  addToCart(productId: number, quantity: number = 1) {
    return this.http
      .post(environment.baseUrl + '/api/v1/cart/items', {
        product_id: productId,
        quantity: quantity,
      })
      .pipe(
        // أول ما الإضافة تنجح، بنبعت إشارة إن السلة اتحدثت
        tap(() => this.cartUpdatedSource.next()),
      );
  }
}
