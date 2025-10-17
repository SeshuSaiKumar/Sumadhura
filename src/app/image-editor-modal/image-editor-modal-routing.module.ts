import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageEditorModalPage } from './image-editor-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ImageEditorModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageEditorModalPageRoutingModule {}
