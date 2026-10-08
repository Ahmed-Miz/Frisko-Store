import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Scart } from '../../../core/services/scart';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly fd = inject(FormBuilder);
  private readonly scart = inject(Scart);

  checkOut: FormGroup = this.fd.group({
    customer_name: ['', [Validators.required]],
    customer_email: ['', [Validators.required]],
    customer_phone: ['', [Validators.required]],
    shipping_address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    payment_method: ['', [Validators.required]],
    coupon_code: [''],
  });

  submitOrder() {
    this.scart.creatVieOrder(this.checkOut.value).subscribe({
      next: (req) => {
        console.log(req);
      },
    });
  }

  //   {
  //   "customer_name": "خالد الشمري",
  //   "customer_email": "khaled@example.com",
  //   "customer_phone": "0509988776",
  //   "shipping_address": "حي النخيل - شارع الأمير تركي الأول",
  //   "city": "الرياض",
  //   "payment_method": "cod",
  //   "coupon_code": "FRISKO20"
  // }
}
