import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateMpinPage } from './generate-mpin.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateMpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateMpinPageRoutingModule {}
