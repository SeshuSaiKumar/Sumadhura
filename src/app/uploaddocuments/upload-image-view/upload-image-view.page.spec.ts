import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadImageViewPage } from './upload-image-view.page';

describe('UploadImageViewPage', () => {
  let component: UploadImageViewPage;
  let fixture: ComponentFixture<UploadImageViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadImageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
