import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MprPageRoutingModule } from './mpr-routing.module';

import { MprPage } from './mpr.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MprPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MprPage , FilterPipe],

})
export class MprPageModule {}
