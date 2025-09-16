import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MpinPoliciesPage } from './mpin-policies.page';

describe('MpinPoliciesPage', () => {
  let component: MpinPoliciesPage;
  let fixture: ComponentFixture<MpinPoliciesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MpinPoliciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
