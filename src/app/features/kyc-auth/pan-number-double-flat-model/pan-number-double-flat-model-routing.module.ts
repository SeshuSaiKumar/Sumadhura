import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanNumberDoubleFlatModelPage } from './pan-number-double-flat-model.page';

const routes: Routes = [
  {
    path: '',
    component: PanNumberDoubleFlatModelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanNumberDoubleFlatModelPageRoutingModule {}
