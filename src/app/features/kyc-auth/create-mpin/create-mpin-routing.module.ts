import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMpinPage } from './create-mpin.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMpinPageRoutingModule {}
