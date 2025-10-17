import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectPage } from './project.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPage
  },
  {
    path: 'project-view',
    loadChildren: () => import('./project-view/project-view.module').then( m => m.ProjectViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectPageRoutingModule {}
