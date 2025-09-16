import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTicketPage } from './view-ticket.page';

describe('ViewTicketPage', () => {
  let component: ViewTicketPage;
  let fixture: ComponentFixture<ViewTicketPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
