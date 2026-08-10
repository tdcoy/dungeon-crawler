import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  next(): number {
    return Math.random();
  }

  nextBool(): boolean {
    return this.next() < 0.5;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
