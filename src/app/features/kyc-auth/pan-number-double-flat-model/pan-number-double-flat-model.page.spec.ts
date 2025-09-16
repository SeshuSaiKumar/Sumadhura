import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanNumberDoubleFlatModelPage } from './pan-number-double-flat-model.page';

describe('PanNumberDoubleFlatModelPage', () => {
  let component: PanNumberDoubleFlatModelPage;
  let fixture: ComponentFixture<PanNumberDoubleFlatModelPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PanNumberDoubleFlatModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
