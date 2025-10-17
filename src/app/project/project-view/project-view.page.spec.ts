import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectViewPage } from './project-view.page';

describe('ProjectViewPage', () => {
  let component: ProjectViewPage;
  let fixture: ComponentFixture<ProjectViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProjectViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
