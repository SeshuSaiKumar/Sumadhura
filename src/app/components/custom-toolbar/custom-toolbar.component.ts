import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

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
  @Input() isModal: boolean = false;  // Add this input
  @Input() modalName: string; // Add this input for modal name
  @Output() dismiss = new EventEmitter<string>();

 
  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() {}

goBack() {
  this.navCtrl.navigateBack(this.backUrl);
}
  onDismiss() {
    this.dismiss.emit(this.modalName);
  }
}
