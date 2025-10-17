import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomToolbarComponent } from './custom-toolbar/custom-toolbar.component';
import { ZoomImgComponent } from './zoom-img/zoom-img.component';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Zoom } from 'swiper';
SwiperCore.use([Zoom]);



@NgModule({
  declarations: [CustomToolbarComponent, ZoomImgComponent],
  imports: [
     CommonModule,
        FormsModule,
        IonicModule,
        SwiperModule
  ],
  exports: [CustomToolbarComponent,ZoomImgComponent], // <-- important

})
export class ComponentsModule { }
