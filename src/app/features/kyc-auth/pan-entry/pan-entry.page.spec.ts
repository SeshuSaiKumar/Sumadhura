import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanEntryPage } from './pan-entry.page';

describe('PanEntryPage', () => {
  let component: PanEntryPage;
  let fixture: ComponentFixture<PanEntryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PanEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
