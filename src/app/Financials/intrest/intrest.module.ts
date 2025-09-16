import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntrestPageRoutingModule } from './intrest-routing.module';

import { IntrestPage } from './intrest.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntrestPageRoutingModule,
    ComponentsModule
  ],
  declarations: [IntrestPage]
})
export class IntrestPageModule {}
