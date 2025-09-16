import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateModelPage } from './generate-model.page';

describe('GenerateModelPage', () => {
  let component: GenerateModelPage;
  let fixture: ComponentFixture<GenerateModelPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GenerateModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
