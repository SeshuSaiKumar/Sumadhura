import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionsPage } from './selections.page';

describe('SelectionsPage', () => {
  let component: SelectionsPage;
  let fixture: ComponentFixture<SelectionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
