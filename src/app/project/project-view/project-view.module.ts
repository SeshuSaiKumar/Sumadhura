import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectViewPageRoutingModule } from './project-view-routing.module';

import { ProjectViewPage } from './project-view.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectViewPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProjectViewPage]
})
export class ProjectViewPageModule {}
