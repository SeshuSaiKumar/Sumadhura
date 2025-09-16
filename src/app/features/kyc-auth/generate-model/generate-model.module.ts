import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateModelPageRoutingModule } from './generate-model-routing.module';

import { GenerateModelPage } from './generate-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateModelPageRoutingModule
  ],
  declarations: [GenerateModelPage]
})
export class GenerateModelPageModule {}
