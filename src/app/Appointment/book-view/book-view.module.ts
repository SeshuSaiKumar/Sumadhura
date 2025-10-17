import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookViewPageRoutingModule } from './book-view-routing.module';

import { BookViewPage } from './book-view.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookViewPageRoutingModule,
    ComponentsModule
  ],
  declarations: [BookViewPage]
})
export class BookViewPageModule {}
