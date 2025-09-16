import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTicketPage } from './view-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTicketPageRoutingModule {}
