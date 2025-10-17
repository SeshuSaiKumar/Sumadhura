import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageEditorModalPage } from './image-editor-modal.page';

describe('ImageEditorModalPage', () => {
  let component: ImageEditorModalPage;
  let fixture: ComponentFixture<ImageEditorModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageEditorModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
