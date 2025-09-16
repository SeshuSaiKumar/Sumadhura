import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanNumberDoubleFlatModelPageRoutingModule } from './pan-number-double-flat-model-routing.module';

import { PanNumberDoubleFlatModelPage } from './pan-number-double-flat-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanNumberDoubleFlatModelPageRoutingModule
  ],
  declarations: [PanNumberDoubleFlatModelPage]
})
export class PanNumberDoubleFlatModelPageModule {}
