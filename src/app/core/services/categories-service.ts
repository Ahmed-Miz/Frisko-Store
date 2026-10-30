import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  getCategories(slug: string): Observable<any> {
    return this.http.get(environment.baseUrl + `/api/v1/categories${slug}`);
  }
}
