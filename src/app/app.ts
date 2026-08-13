import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  private router = inject(Router);

  isAboutPage(): boolean {
    return this.router.url === '/about';
  }
}