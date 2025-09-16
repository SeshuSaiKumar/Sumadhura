import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanEntryPage } from './pan-entry.page';

const routes: Routes = [
  {
    path: '',
    component: PanEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanEntryPageRoutingModule {}
