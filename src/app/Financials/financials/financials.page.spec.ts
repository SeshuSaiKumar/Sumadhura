import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialsPage } from './financials.page';

describe('FinancialsPage', () => {
  let component: FinancialsPage;
  let fixture: ComponentFixture<FinancialsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FinancialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
