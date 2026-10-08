import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../core/services/product';
import { error, log } from 'console';
import { Iproduct } from '../../core/models/iproduct';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Scart } from '../../core/services/scart';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private product = inject(Product);
  private scart = inject(Scart);
  private toastrService = inject(ToastrService);
  isLoading = signal<boolean>(false);
  productList = signal<Iproduct[]>([]);

  ngOnInit(): void {
    this.getProduct();
    this.route.queryParams.subscribe((params) => {
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
    this.route.queryParams.subscribe((params) => {
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

  addToCart(id: number | string, quan: number): void {
    const body = { product_id: id, quantity: quan };
    if (localStorage.getItem('freshToken')) {
      this.scart.addProductCart(body).subscribe({
        next: (req) => {
          this.toastrService.success('Product add in success fully to your cart', 'Frisko', {
            progressBar: true,
            closeButton: true,
          });
          console.log(req);
          // 1. هات المنتجات القديمة المخزنة أصلاً في الـ localCart (لو مفيش رجع مصفوفة فاضية)
          let existingCart = JSON.parse(localStorage.getItem('localCart') || '[]');

          // 2. طلع المنتجات الجديدة اللي راجعة من الـ API (حسب المسار الصحيح اللي أكدت إنه شغال عندك)
          const newItems = req.data?.cart?.items || req.data?.items || [];

          // 3. ادمجهم مع بعض أو حدّث الكميات بدل ما تمسح القديم
          // لو الـ API بيرجع عنصر واحد مضاف، بنضيفه للمصفوفة القديمة أو بنزود الكمية لو موجود
          newItems.forEach((newItem: any) => {
            const index = existingCart.findIndex(
              (item: any) => item.id === newItem.id || item.product_id === newItem.product_id,
            );

            if (index > -1) {
              // لو المنتج موجود قبل كده، حدث الكمية
              existingCart[index].quantity = newItem.quantity;
            } else {
              // لو منتج جديد، ارفقه مع المصفوفة القديمة
              existingCart.push(newItem);
            }
          });

          // 4. خزّن المصفوفة المجمعة النهائية في الـ LocalStorage
          localStorage.setItem('localCart', JSON.stringify(existingCart));

          console.log('Updated Cart Array:', existingCart);
        },
      });
    } else {
      this.toastrService.warning('Please Login', 'Frisko', {
        progressBar: true,
        closeButton: true,
      });
    }
  }

  // private cartService = inject(CartService);

  // // دالة زرار "أضف إلى السلة"
  // onAddButtonClicked(productId: number) {
  //   this.cartService.addToCart(productId, 1).subscribe({
  //     next: (res) => {
  //       console.log('تم إضافة المنتج بنجاح!', res);
  //       // هنا ممكن تظهر رسالة نجاح (Toast / Alert) للمستخدم
  //     },
  //     error: (err) => {
  //       console.error('حدث خطأ أثناء الإضافة:', err);
  //     },
  //   });
  // }

  isNewProduct(created_at: string): boolean {
    const productDate = new Date(created_at).getTime();
    const currentDate = new Date().getTime();
    const diffDays = (currentDate - productDate) / (1000 * 3600 * 24);
    return diffDays <= 14;
  }
}
