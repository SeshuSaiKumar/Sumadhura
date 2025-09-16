import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMpinPageRoutingModule } from './create-mpin-routing.module';

import { CreateMpinPage } from './create-mpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMpinPageRoutingModule
  ],
  declarations: [CreateMpinPage]
})
export class CreateMpinPageModule {}
