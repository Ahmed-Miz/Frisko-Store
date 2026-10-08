import { Component } from '@angular/core';
import { Slider } from '../../../shared/components/slider/slider';
import { ProductDetails } from '../../product-details/product-details';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [Slider, ProductDetails, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {}
