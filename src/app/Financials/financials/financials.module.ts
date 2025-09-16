import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancialsPageRoutingModule } from './financials-routing.module';

import { FinancialsPage } from './financials.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FinancialsPage]
})
export class FinancialsPageModule {}
