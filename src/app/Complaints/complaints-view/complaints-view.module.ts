import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintsViewPageRoutingModule } from './complaints-view-routing.module';

import { ComplaintsViewPage } from './complaints-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplaintsViewPageRoutingModule
  ],
  declarations: [ComplaintsViewPage]
})
export class ComplaintsViewPageModule {}
