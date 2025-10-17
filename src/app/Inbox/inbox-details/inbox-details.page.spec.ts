import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxDetailsPage } from './inbox-details.page';

describe('InboxDetailsPage', () => {
  let component: InboxDetailsPage;
  let fixture: ComponentFixture<InboxDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InboxDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
