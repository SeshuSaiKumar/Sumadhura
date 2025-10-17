import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTicketPageRoutingModule } from './view-ticket-routing.module';

import { ViewTicketPage } from './view-ticket.page';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncatePipe } from './truncate.pipe';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTicketPageRoutingModule,
        ReactiveFormsModule,
    FileUploadModule,
    ComponentsModule
  ],
  declarations: [ViewTicketPage,TruncatePipe]
})
export class ViewTicketPageModule {}
