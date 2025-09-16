import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTicketPageRoutingModule } from './view-ticket-routing.module';

import { ViewTicketPage } from './view-ticket.page';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTicketPageRoutingModule,
        ReactiveFormsModule,
    FileUploadModule,
  ],
  declarations: [ViewTicketPage]
})
export class ViewTicketPageModule {}
