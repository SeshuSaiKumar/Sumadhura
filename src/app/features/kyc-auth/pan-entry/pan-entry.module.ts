import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanEntryPageRoutingModule } from './pan-entry-routing.module';

import { PanEntryPage } from './pan-entry.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanEntryPageRoutingModule
  ],
  declarations: [PanEntryPage],


})
export class PanEntryPageModule {}
