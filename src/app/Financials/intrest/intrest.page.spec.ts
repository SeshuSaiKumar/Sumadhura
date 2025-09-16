import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntrestPage } from './intrest.page';

describe('IntrestPage', () => {
  let component: IntrestPage;
  let fixture: ComponentFixture<IntrestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IntrestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
