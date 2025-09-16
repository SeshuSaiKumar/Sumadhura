import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateMpinPageRoutingModule } from './generate-mpin-routing.module';

import { GenerateMpinPage } from './generate-mpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateMpinPageRoutingModule
  ],
  declarations: [GenerateMpinPage]
})
export class GenerateMpinPageModule {}
