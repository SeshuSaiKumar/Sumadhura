import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemandPageRoutingModule } from './demand-routing.module';

import { DemandPage } from './demand.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemandPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DemandPage]
})
export class DemandPageModule {}
