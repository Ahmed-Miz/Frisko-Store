import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Scart {
  private readonly http = inject(HttpClient);
  cartItemCount = new BehaviorSubject<number>(0);

  addProductCart(body: object): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/cart/items', body).pipe(
      tap((res: any) => {
        // افترضنا إن الـ API بيرجع الـ count أو عدد المنتجات بالشكل ده (عدل حسب شكل رداAPI بتاعك)
        const count = res.numOfCartItems || res.data?.products?.length || 0;
        this.cartItemCount.next(count);
      }),
    );
  }

  // get
  addItemsCart(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/v1/cart');
  }

  creatVieOrder(data: object): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/checkout', data);
  }
}
