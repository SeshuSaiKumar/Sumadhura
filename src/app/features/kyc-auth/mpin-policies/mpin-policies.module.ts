import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MpinPoliciesPageRoutingModule } from './mpin-policies-routing.module';

import { MpinPoliciesPage } from './mpin-policies.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MpinPoliciesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MpinPoliciesPage]
})
export class MpinPoliciesPageModule {}
