import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MpinPoliciesPage } from './mpin-policies.page';

const routes: Routes = [
  {
    path: '',
    component: MpinPoliciesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MpinPoliciesPageRoutingModule {}
