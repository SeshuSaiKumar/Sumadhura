import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MprPage } from './mpr.page';

describe('MprPage', () => {
  let component: MprPage;
  let fixture: ComponentFixture<MprPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MprPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
