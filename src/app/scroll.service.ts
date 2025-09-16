import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollPosition: number = 0;

  setScrollPosition(position: number) {
    this.scrollPosition = position;
  }

  getScrollPosition(): number {
    return this.scrollPosition;
  }

  clearScrollPosition() {
    
    this.scrollPosition = 0;
  }


  clearScrollPosition1() {
    
    this.scrollPosition = 0;
  }

}
