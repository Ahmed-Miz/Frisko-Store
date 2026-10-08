import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Frisko-store');
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
}
