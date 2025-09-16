import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectionsPageRoutingModule } from './selections-routing.module';

import { SelectionsPage } from './selections.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectionsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SelectionsPage]
})
export class SelectionsPageModule {}
