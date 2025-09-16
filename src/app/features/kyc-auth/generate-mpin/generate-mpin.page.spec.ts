import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateMpinPage } from './generate-mpin.page';

describe('GenerateMpinPage', () => {
  let component: GenerateMpinPage;
  let fixture: ComponentFixture<GenerateMpinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GenerateMpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
