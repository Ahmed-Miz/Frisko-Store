import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Sauth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  isLogged = signal<boolean>(false);

  singout(): void {
    localStorage.removeItem('freshToken');
    this.isLogged.set(false);
    this.router.navigate(['/home']);
  }

  signUp(data: object): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/auth/register', data);
  }

  signIn(data: object): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/v1/auth/login', data);
  }
}
