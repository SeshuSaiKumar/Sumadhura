import { Component } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { ScrollService } from './scroll.service';
import { LoaderService } from './LoaderService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoading = false;
  constructor(private platform: Platform, private router: Router, private common: CommonService,
    private scrollService: ScrollService, private loaderService: LoaderService,
    public modalCtrl: ModalController, private alertController: AlertController, private authService: AuthService) {

    this.loaderService.loaderState$.subscribe((state) => {
      this.isLoading = state;
      console.log(this.isLoading);
    });

  }

  async ngOnInit() {

     if (localStorage.getItem("mpinhandle") != null && localStorage.getItem("mpinhandle") != "null" && localStorage.getItem("mpinhandle") !== undefined &&
      localStorage.getItem("mpinhandle") !== "undefined" && localStorage.getItem("mpinhandle") !== "") {
      this.router.navigate(['/generate-mpin']);
    } else {
      this.router.navigate(['/pan-entry']);
    }


  }

}
