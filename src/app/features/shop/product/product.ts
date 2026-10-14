import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Scart } from '../../../core/services/scart';
import { Iproduct } from '../../../core/models/iproduct';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SProduct } from '../../../core/services/s-product';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private route = inject(Router);
  private product = inject(SProduct);
  private scart = inject(Scart);
  private pLATFORM_ID = inject(PLATFORM_ID);
  private toastrService = inject(ToastrService);
  isLoading = signal<boolean>(false);
  productList = signal<Iproduct[]>([]);

  ngOnInit(): void {
    this.getProduct();
    this.activatedRoute.queryParams.subscribe((params) => {
      const searchKeyword = params['search']; // دي الكلمة اللي جاية من النافبار

      if (searchKeyword) {
        this.fetchProducts(searchKeyword); // لو فيه كلمة بحث، ابعت هات المنتجات بالبحث
      } else {
        this.fetchProducts(); // لو مفيش بحث، هات كل المنتجات عادي
      }
    });
  }

  fetchProducts(searchKey?: string) {
    this.isLoading.set(true);
    let params = new HttpParams();

    if (searchKey) {
      params = params.set('search', searchKey);
    }
  }
  getProduct(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.product.getProduct(params).subscribe({
        next: (res) => {
          let data = res.data.data;
          this.productList.set(data);
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  openProductDetails(id: string | number): void {
    this.route.navigate(['/productDetails', id]);
  }

  isNewProduct(created_at: string): boolean {
    const productDate = new Date(created_at).getTime();
    const currentDate = new Date().getTime();
    const diffDays = (currentDate - productDate) / (1000 * 3600 * 24);
    return diffDays <= 14;
  }
}
