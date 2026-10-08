import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, Router } from '@angular/router';
import { Sauth } from '../../../features/auth/services/sauth';
import { isPlatformBrowser } from '@angular/common';
import { Scart } from '../../../core/services/scart';
import { Product } from '../../../core/services/product';
import { Iproduct } from '../../../core/models/iproduct';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private sauth = inject(Sauth);
  private product = inject(Product);
  productList = signal<Iproduct[]>([]);

  cartCount = 0;
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.sauth.isLogged.set(true);
      }
    }

    this.getProduct();
  }

  navLinks = [
    { name: 'Men', query: { category: 1 } },
    { name: 'Women', query: { category: 2 } },
    { name: 'Kids', query: { category: 'kids' } },
    { name: 'New Arrivals', query: { sort_by: 'latest' } },
    { name: 'Sale', query: { sale: true } },
  ];

  getProduct(): void {
    this.product.getProduct().subscribe({
      next: (res) => {
        let data = res.data.data;
        this.productList.set(data);
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // button singOut
  logged = computed(() => this.sauth.isLogged());
  logout(): void {
    this.sauth.singout();
  }
  onSearch(keyword: string) {
    console.log('القيمة اللي اتحكتبت فعلاً:', keyword);

    if (!keyword || !keyword.trim()) {
      console.log('الكلمة فاضية، عشان كده وقف!');
      return;
    }

    this.router
      .navigate(['/shop'], {
        queryParams: { search: keyword.trim() },
      })
      .then((success) => {
        console.log('تم الانتقال بنجاح:', success);
      });
  }
}
