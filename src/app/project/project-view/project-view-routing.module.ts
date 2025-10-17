import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectViewPage } from './project-view.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectViewPageRoutingModule {}
