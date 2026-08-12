import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  next(): number {
    return Math.random();
  }

  nextFloat(): number {
    return Math.random();
  }

  nextBool(): boolean {
    return this.next() < 0.5;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextNormal(mean: number, standardDeviation: number): number {
    let u = 0;
    let v = 0;

    // Avoid Math.log(0)
    while (u === 0) {
      u = this.nextFloat();
    }

    while (v === 0) {
      v = this.nextFloat();
    }

    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    return mean + z * standardDeviation;
  }
}
