import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly translate = inject(TranslateService);
  chengeDirection(): void {
    if (localStorage.getItem('lang') === 'tr') {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'tr');
    } else if (localStorage.getItem('lang') === 'en') {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    } else if (localStorage.getItem('lang') === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    }
  }

  changeLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.chengeDirection();
  }
}
