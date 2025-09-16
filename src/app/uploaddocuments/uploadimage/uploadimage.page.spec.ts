import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadimagePage } from './uploadimage.page';

describe('UploadimagePage', () => {
  let component: UploadimagePage;
  let fixture: ComponentFixture<UploadimagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadimagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
