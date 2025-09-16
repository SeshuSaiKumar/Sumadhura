import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadImageViewPageRoutingModule } from './upload-image-view-routing.module';

import { UploadImageViewPage } from './upload-image-view.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadImageViewPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UploadImageViewPage]
})
export class UploadImageViewPageModule {}
