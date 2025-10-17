import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintsViewPage } from './complaints-view.page';

const routes: Routes = [
  {
    path: '',
    component: ComplaintsViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintsViewPageRoutingModule {}
