import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Network } from '@capacitor/network';
import { LoaderService } from './LoaderService';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private isDismissing = false;
  private subject = new Subject<any>();
  private subject1 = new Subject<any>();
  private loader: HTMLIonLoadingElement | any;
  public loginDetails = new Subject<any>();

  commonservice: any = "http://144.24.96.219:8888/SumadhuraGateway/customerservice/"
  //commonservice1: any = "http://144.24.96.219:8888/SumadhuraGateway/employeeservice/";
  appVersion = "1.2";
  deviceToken = "dH_jJzd_i2g:APA91bFS94XaGhRVndsEsEPsq8l8-XU4IiZLN7Ryf0wBQJKafZXbC3Zu0wXJxQPkEofYTF3mmMh18v2kFO_sURici-FVL6sKq9dCskVmaA3Nbr-wPSCM34ruwH_BQngoG-Jxhem1DhaE"
  deviceModel = "M2010J19SI";
  serialNo = "70af463";
  osType = "Android";
  osVersion = "10";
  uuid = "0edacfa6cf76075dR";

  // deviceToken: any;
  // osVersion: any;
  // uuid: any;
  // osType: any;
  // serialNo: any;
  // deviceModel: any;

  loading: any;
  osVersion1: any;
  uuid1: any;
  name: any;
  platform1: any;

  constructor(
    public alertController: AlertController,
    public route: Router, public loadingController: LoadingController,
    public toastController: ToastController,
    private platform: Platform, private loaderService: LoaderService,
  ) {
    this.platform.ready().then(async (res) => {
      // this.osVersion = (await Device.getInfo()).osVersion;
      // this.uuid = (await Device.getId()).identifier
      // this.name = (await Device.getInfo()).name;
      // this.osType = (await Device.getInfo()).operatingSystem;
      // this.serialNo = "70af463";
      // this.deviceModel = (await Device.getInfo()).model;
      this.initPush();
      this.initttPush();
    });
  }

  ////////// Alert Message //////////////
  async presentAlert(text: string) {
    const alert = await this.alertController.create({
      header: 'Sumadhura',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentConfirm(message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false); // User canceled
            }
          },
          {
            text: 'OK',
            handler: () => {
              resolve(true); // User confirmed
            }
          }
        ]
      });

      await alert.present();
    });
  }

  //////////// Alert Message For Qiestion /////////
  async presentQuestionAlert(text: any) {
    const alert = await this.alertController.create({
      header: 'You Should Call 911',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  ///////////// Network Connection Error Message//////////

async NetworkpresentAlert(isOffline: boolean = true) {
  const alert = await this.alertController.create({
    header: isOffline ? 'No Internet' : 'Network Restored',
    message: isOffline
      ? 'You are offline. Please check your internet connection.'
      : 'Your internet connection is back online.',
    buttons: ['OK'],
    backdropDismiss: false // prevent dismiss by tapping outside
  });
  await alert.present();
}


  //////// Toast message //////////
  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  ////////// Present Loading ///////////////
  async presentLoading() {
    if (!this.loader) {
      this.loader = await this.loadingController.create({ message: 'Please Wait...' });
      await this.loader.present();
    }
  }
  async dismissLoading() {
    if (this.isDismissing) {
      return; // Prevent multiple dismissals
    }
    this.isDismissing = true;
    try {
      if (this.loader) {
        await this.loader.dismiss();
        this.loader = null;
      } else {
        const topLoader = await this.loadingController.getTop();
        if (topLoader) {
          await topLoader.dismiss();
        }
      }
    } catch (err) {
      console.error('Error dismissing loader:', err);
    } finally {
      this.isDismissing = false;
    }
  }


  async initPush() {
    await PushNotifications.register().then((res) => {
    }).catch((err) => {
    })

    const addListeners = async () => {
      await PushNotifications.addListener('registration', token => {
      });
      await PushNotifications.addListener('registrationError', err => {
      });
      await PushNotifications.addListener('pushNotificationReceived', notification => {
      });
      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      });
    }

    const getDeliveredNotifications = async () => {
      const notificationList = await PushNotifications.getDeliveredNotifications();
    }

  }

  public initttPush() {
    PushNotifications.requestPermissions().then(async result => {
      if (result.receive === 'granted') {
        await PushNotifications.register();
      } else {

      }
    });
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.deviceToken = token.value;
      }
    );
    PushNotifications.addListener('registrationError',
      (error: any) => {
      }
    );
  }

  usercreation_sendname(number3: number) {
    this.subject.next({ text: number3 });
  }

  usercreation_getname(): Observable<any> {
    return this.subject.asObservable();
  }

}
