import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageEditorModalPageRoutingModule } from './image-editor-modal-routing.module';

import { ImageEditorModalPage } from './image-editor-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageEditorModalPageRoutingModule
  ],
  declarations: [ImageEditorModalPage]
})
export class ImageEditorModalPageModule {}
