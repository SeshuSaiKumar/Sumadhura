import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyViewPage } from './company-view.page';

describe('CompanyViewPage', () => {
  let component: CompanyViewPage;
  let fixture: ComponentFixture<CompanyViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
