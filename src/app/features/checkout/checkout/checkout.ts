import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Scart } from '../../../core/services/scart';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly fd = inject(FormBuilder);
  private readonly scart = inject(Scart);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  checkOut: FormGroup = this.fd.group({
    customer_name: ['', [Validators.required]],
    customer_email: ['', [Validators.required, Validators.email]],
    customer_phone: ['', [Validators.required]],
    shipping_address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    payment_method: ['', [Validators.required]],
    coupon_code: [''],
  });
  submitOrder() {
    if (this.checkOut.invalid) {
      this.checkOut.markAllAsTouched();
      return;
    }

    // 1. سحب المنتجات من الـ localCart
    const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');

    if (localCart.length === 0) {
      this.toastr.error('السلة فارغة، أضف منتجات أولاً', 'تنبيه');
      return;
    }

    // 2. تجهيز مصفوفة الitems بالشكل السليم اللي الباك إند طالبها بالمللي
    const formattedItems = localCart.map((item: any) => ({
      product_id: item.product_id || item.product?.id || item.id,
      quantity: Number(item.quantity) || 1,
    }));

    // 3. دمج بيانات الفورم مع مصفوفة المنتجات في كائن واحد
    const checkoutBody = {
      ...this.checkOut.value,
      items: formattedItems,
    };

    console.log('Body رايح للباك إند:', checkoutBody);

    // 4. الإرسال
    this.scart.creatVieOrder(checkoutBody).subscribe({
      next: (req) => {
        console.log('تمت العملية بنجاح:', req);
        this.toastr.success(req.message, 'Frisko');

        // مسح السلة بعد نجاح الأوردر
        localStorage.removeItem('localCart');
      },
    });
  }
}
