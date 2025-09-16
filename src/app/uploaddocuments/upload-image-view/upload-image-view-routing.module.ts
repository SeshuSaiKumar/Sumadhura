import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadImageViewPage } from './upload-image-view.page';

const routes: Routes = [
  {
    path: '',
    component: UploadImageViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadImageViewPageRoutingModule {}
