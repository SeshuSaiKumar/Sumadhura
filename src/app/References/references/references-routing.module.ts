import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferencesPage } from './references.page';

const routes: Routes = [
  {
    path: '',
    component: ReferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferencesPageRoutingModule {}
