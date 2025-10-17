import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-zoom-img',
  templateUrl: './zoom-img.component.html',
  styleUrls: ['./zoom-img.component.scss']
})
export class ZoomImgComponent {
  @Input() images: string[] = [];
  @Input() title: string = '';

  activeModal = false;
  selectedImageIndex = 0;

  openModal(index: number = 0) {
    this.selectedImageIndex = index;
    this.activeModal = true;
  }

  closeModal() {
    this.activeModal = false;
  }
}
