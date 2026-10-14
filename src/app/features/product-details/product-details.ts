import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SProduct } from '../../core/services/s-product';
import { Scart } from '../../core/services/scart';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  // استخدام inject للخدمات لو بتفضلها
  route = inject(ActivatedRoute);
  productService = inject(SProduct);
  private scart = inject(Scart);
  private toastrService = inject(ToastrService);
  isLoading = signal<boolean>(true);
  product = signal<any>('');
  // 1. أضف متغير الكمية هنا
  quantity = signal<number>(1);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchProductDetails(id);
      }
    });
  }

  fetchProductDetails(id: string | number): void {
    this.isLoading.set(true);
    this.productService.getProductDetails(id).subscribe({
      next: (req) => {
        this.product.set(req.data.product);
        console.log(this.product());
        console.log(id);
        this.isLoading.set(false);
      },
    });
  }

  addToCart(id: number | string): void {
    const body = { product_id: id, quantity: this.quantity() };

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
  }
}
