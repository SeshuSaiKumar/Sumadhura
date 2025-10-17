import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPageRoutingModule } from './project-routing.module';

import { ProjectPage } from './project.page';
import { ComponentsModule } from '../components/components.module';
import { ProductService } from './project-view/product.service';
import { TruncatePipe } from './truncate.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectPageRoutingModule,
    ComponentsModule,
    
  ],
  declarations: [ProjectPage,TruncatePipe,FilterPipe],
    providers :[ProductService]

})
export class ProjectPageModule {}
