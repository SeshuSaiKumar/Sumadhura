import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadimagePageRoutingModule } from './uploadimage-routing.module';

import { UploadimagePage } from './uploadimage.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadimagePageRoutingModule,
    ComponentsModule
  ],
  declarations: [UploadimagePage]
})
export class UploadimagePageModule {}
