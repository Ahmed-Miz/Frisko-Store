import { Scart } from './../../../core/services/scart';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductDetails } from '../../product-details/product-details';
import { Slider } from '../../../shared/components/slider/slider';
import { RouterLink } from '@angular/router';
import { Shome } from '../../../core/services/shome';
import { Icategories } from '../../../core/models/icategories';
import { IlatestProducts } from '../../../core/models/ilatest-products';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [Slider, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  ngOnInit(): void {
    this.loadHomeData();
  }
  private shome = inject(Shome);
  private scart = inject(Scart);
  private toastrService = inject(ToastrService);

  categories = signal<Icategories[]>([]);
  latestProducts = signal<IlatestProducts[]>([]);
  loadHomeData(): void {
    this.shome.getHome().subscribe({
      next: (res) => {
        const homeData = res.data;

        this.categories.set(homeData.categories);
        this.latestProducts.set(homeData.latest_products);
        console.log(this.latestProducts());
      },
      error: (err) => {
        console.log(err);
      },
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
          let existingCart = JSON.parse(localStorage.getItem('localCart') || '[]');

          const newItems = req.data?.cart?.items || req.data?.items || [];

          newItems.forEach((newItem: any) => {
            const index = existingCart.findIndex(
              (item: any) => item.id === newItem.id || item.product_id === newItem.product_id,
            );

            if (index > -1) {
              existingCart[index].quantity = newItem.quantity;
            } else {
              existingCart.push(newItem);
            }
          });

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

  isNewProduct(created_at: string): boolean {
    const productDate = new Date(created_at).getTime();
    const currentDate = new Date().getTime();
    const diffDays = (currentDate - productDate) / (1000 * 3600 * 24);
    return diffDays <= 14;
  }
}
