import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplaintsViewPage } from './complaints-view.page';

describe('ComplaintsViewPage', () => {
  let component: ComplaintsViewPage;
  let fixture: ComponentFixture<ComplaintsViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComplaintsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
