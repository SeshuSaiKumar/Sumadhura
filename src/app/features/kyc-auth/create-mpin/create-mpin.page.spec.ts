import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMpinPage } from './create-mpin.page';

describe('CreateMpinPage', () => {
  let component: CreateMpinPage;
  let fixture: ComponentFixture<CreateMpinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateMpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
