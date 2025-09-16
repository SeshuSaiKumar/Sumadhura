import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemandPage } from './demand.page';

describe('DemandPage', () => {
  let component: DemandPage;
  let fixture: ComponentFixture<DemandPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DemandPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
