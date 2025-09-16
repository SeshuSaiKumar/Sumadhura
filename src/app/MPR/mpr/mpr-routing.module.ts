import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MprPage } from './mpr.page';

const routes: Routes = [
  {
    path: '',
    component: MprPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MprPageRoutingModule {}
