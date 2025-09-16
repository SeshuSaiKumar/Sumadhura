import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomToolbarComponent } from './custom-toolbar/custom-toolbar.component';



@NgModule({
  declarations: [CustomToolbarComponent],
  imports: [
     CommonModule,
        FormsModule,
        IonicModule,
  ],
  exports: [CustomToolbarComponent], // <-- important

})
export class ComponentsModule { }
