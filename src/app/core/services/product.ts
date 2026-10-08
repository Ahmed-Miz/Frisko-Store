import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private readonly http = inject(HttpClient);

  getProduct(filters?: any): Observable<any> {
    let params = new HttpParams();

    // لو مبعوث فلترز، بنحطها في الـ params
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }

    // بنبعت الـ params مع الـ GET request
    return this.http.get(environment.baseUrl + '/api/v1/products', { params });
  }
}
