import { Component } from '@angular/core';
import { Slider } from '../../../shared/components/slider/slider';
import { RouterLink } from '@angular/router';
import { Product } from '../product/product';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-shop',
  imports: [Slider, RouterLink, Product, TranslatePipe],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {}
