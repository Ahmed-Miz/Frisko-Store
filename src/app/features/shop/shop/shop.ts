import { Component } from '@angular/core';
import { Slider } from '../../../shared/components/slider/slider';
import { RouterLink } from '@angular/router';
import { Product } from '../product/product';

@Component({
  selector: 'app-shop',
  imports: [Slider, RouterLink, Product],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {}
