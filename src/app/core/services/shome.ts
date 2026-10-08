import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Shome {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://seashell-caterpillar-570146.hostingersite.com/api/v1/home';

  getHome(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
