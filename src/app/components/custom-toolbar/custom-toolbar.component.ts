import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-custom-toolbar',
  templateUrl: './custom-toolbar.component.html',
  styleUrls: ['./custom-toolbar.component.scss'],
})
export class CustomToolbarComponent  implements OnInit {
 @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() showMenuButton: boolean = false;
  @Input() showThreeDots: boolean = false;
  @Input() backUrl: string = '';


  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

goBack() {
  this.navCtrl.navigateBack(this.backUrl);
}
}
