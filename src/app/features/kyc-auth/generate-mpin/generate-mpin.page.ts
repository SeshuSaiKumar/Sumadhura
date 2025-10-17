import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController, NavController } from '@ionic/angular';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { Network } from '@capacitor/network';
import { GenerateModelPage } from '../generate-model/generate-model.page';
@Component({
  selector: 'app-generate-mpin',
  templateUrl: './generate-mpin.page.html',
  styleUrls: ['./generate-mpin.page.scss'],
})
export class GenerateMpinPage implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  mpin1: any;
  mpin2: any;
  mpin3: any;
  mpin4: any;
  hidegrid: boolean = true;
  totalmpin: string;
  @ViewChild('a') mpinInput1: any;
  @ViewChild('b') mpinInput2: any;
  @ViewChild('c') mpinInput3: any;
  @ViewChild('d') mpinInput4: ElementRef;
  @ViewChild('firstName') firstNameElement: ElementRef;
  @ViewChild('inputBox') inputBoxes!: QueryList<ElementRef>;
  my_id: any;
  my_notification_View: any;
  flatsLength: any;
  disconnectSubscription: any;
  flatbooking_Id: any;
  number: any = 0;
  tempnum: any = 0;
  sessionnumber: any;
  notificationPopUpMessage: any;
  mpin: string[] = ['', '', '', ''];
  username: string | null;

  constructor(
    private toastCtrl: ToastController,
    public ajaxCall: CommonService,
    private modalCtrl: ModalController,
    public cmn: CommonService,
    public el: ElementRef,
    public renderer: Renderer2,
    public platform: Platform,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private alertcntrl: AlertController,
    public common: CommonService,
    public loader: LoaderService,

  ) {

    this.username = localStorage.getItem("username");
    this.route.queryParamMap.subscribe(params => {
      this.my_id = params.get('complaintId');
      this.flatbooking_Id = params.get('flatbookingId');
      this.my_notification_View = params.get('Forviewpage');
    });
  }
  ngOnInit() {
    this.mpin1 = '';
    this.mpin2 = '';
    this.mpin3 = '';
    this.mpin4 = '';
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
      this.clearMpin();
  }

  isShown = false;
  getCodeBoxElement(index: any) {
    return document.getElementById('codeBox' + index);
  }

  moveToNext(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length === 1) {
      const inputs = this.otpInputs.toArray();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        setTimeout(() => nextInput.nativeElement.focus(), 50);
      }
    }
    if (value.length === 0 && event.inputType === 'deleteContentBackward' && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      setTimeout(() => prevInput.nativeElement.focus(), 50);
    }
  }

  eventHandler(event: any) {
  }

  checkFocus() {
  }
  blurFun() {
  }

  login() {
    // Step 1: Check flatbooking id mismatch
    if (this.flatbooking_Id && this.flatbooking_Id !== localStorage.getItem("flat_booking_id")) {
      this.cmn.presentAlert("Session mismatch! Please re-login.");
      return;
    }

    // Step 2: Collect MPIN
    const enteredMPIN = this.mpin.join("").trim();

    // Step 3: Empty check
    if (!enteredMPIN) {
      this.clearLoginMpin();
      this.cmn.presentAlert("Please enter your MPIN.");
      return;
    }

    // Step 4: Length check
    if (enteredMPIN.length !== 4) {
      this.clearLoginMpin();
      this.cmn.presentAlert("Your MPIN must be 4 digits.");
      return;
    }

    // Step 5: Numeric check
    if (!/^\d{4}$/.test(enteredMPIN)) {
      this.clearLoginMpin();
      this.cmn.presentAlert("MPIN should only contain numbers.");
      return;
    }

    // Step 6: Save login status and proceed
    localStorage.setItem("loginstatus", "true");
    this.callingLogin();
  }

  clearLoginMpin() {
    this.mpin = ['', '', '', ''];
  }

  pageRenderAboutsus() {
    this.navCtrl.navigateForward('/aboutus');
  }
  pageRenderFaq() {
    this.navCtrl.navigateForward('/faq');
  }
  async forgot_redirection() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot MPIN',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            sessionStorage.setItem('from_forgot_mpin', 'true');
            this.router.navigateByUrl('/pan-entry');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('* App Cancel! *');
          }
        }
      ]
    });
    await alert.present();
  }

  async MPIN_Policies_redirection() {
    this.router.navigateByUrl("mpin-policies");
  }

  async callingLogin() {

    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert("No internet connection. Please check your network and try again.");
      return;
    }

    this.totalmpin = this.mpin.join('');
    localStorage.setItem("deviceTokenId", this.cmn.deviceToken || "");
    localStorage.setItem('loginpinsession', this.totalmpin);
    this.loader.showLoader();
    const url = this.common.commonservice + "login/authenticate.spring";
    const headers = { 'Content-Type': 'application/json' };
    const flatId = localStorage.getItem('Myflat_id');
    let body;
    if (!flatId) {
      body = {
        deviceId: this.cmn.deviceToken || "null",
        username: this.cmn.uuid || "null",
        password: this.totalmpin || "null",
        uuid: this.cmn.uuid || "null",
        serialNo: this.cmn.serialNo || "null",
        version: this.cmn.appVersion,
      };
    } else {
      body = {
        deviceId: this.cmn.deviceToken || "null",
        username: this.cmn.uuid || "null",
        password: this.totalmpin || "null",
        uuid: this.cmn.uuid || "null",
        serialNo: this.cmn.serialNo || "null",
        appRegId: localStorage.getItem('appRegId') || "null",
        flatId: flatId,
        custId: localStorage.getItem('mycustId') || "null",
        version: this.cmn.appVersion,
      };
    }

    console.log(url);
    console.log(JSON.stringify(body));
    try {
      const response = await CapacitorHttp.post({ url, headers, data: body });

      const resp = response.data;
      console.log(resp);
      await this.loader.hideLoader();
      this.notificationPopUpMessage = resp.notificationPopUpMessage;
      localStorage.setItem("deviceTokenId", this.cmn.deviceToken || '');
      localStorage.setItem('loginpinsession', this.totalmpin);
      localStorage.setItem("appInfostattus", "false");
      localStorage.setItem("mpinhandle", resp.custId)
                localStorage.setItem('sessionKey', resp.sessionKey);
                console.log("sessionKey:", resp.sessionKey);
                

      const myflatids = resp.flats || [];
      switch (resp.responseCode) {
        case 523:
          this.clearMpin();
          await this.showUpdateAlert(resp.status);
          break;

        case 534:
          await this.showUpdateAlert(resp.status);
          break;

        case 536:
          if (!this.cmn.deviceToken) {
            // this.cmn.presentAlert(resp.status);
          }
          localStorage.setItem("projectName", localStorage.getItem("projectName") || "");
          this.notificationPopUpMessage = localStorage.getItem("contactmessage");
          localStorage.setItem('appRegId', resp.appRegId);
          localStorage.setItem('flats', JSON.stringify(resp.flats));
          localStorage.setItem('flats_dashboard', myflatids[0]?.flatId || "");
          localStorage.setItem('flatNo', myflatids[0]?.flatNo || "");
          localStorage.setItem('mycustId', resp.custId);
          localStorage.setItem('flatsLength', myflatids.length.toString());
          localStorage.setItem('sessionKey', resp.sessionKey);

          if (myflatids.length > 0) {
            localStorage.setItem('flats', JSON.stringify(myflatids));
          } else {
            console.warn('No flat data received to save!');
          }

          this.router.navigateByUrl("dashboard");

          if (!this.my_id) {
            const modal = await this.modalCtrl.create({
              component: GenerateModelPage,
              componentProps: { myflatids }
            });
            console.log("myflatids:", myflatids);
            await modal.present();
            // this.cmn.presentAlert(resp.status);
            modal.onDidDismiss().then(() => {
              const menu = document.querySelector('ion-menu');
              if (menu) (menu as any).swipeEnable = true;
            });
          } else {
            localStorage.setItem('sessionkey', resp.sessionKey);
          }
          break;

        case 537:
          if (!resp.flats || resp.flats.length === 0) {
            this.clearMpin();
            localStorage.clear();

          } else {
            // Show alert
            const alert = await this.alertCtrl.create({
              header: 'Message',
              message: resp.status,
              buttons: []
            });

            await alert.present();

            // Auto dismiss after 2 seconds
            setTimeout(async () => {
              await alert.dismiss();

              // Then open modal
              const modal = await this.modalCtrl.create({
                component: GenerateModelPage,
                componentProps: { myflatids }
              });
              await modal.present();
            }, 2000);

          }
          break;

        case 538:
          if (!localStorage.getItem("deviceTokenId")) {
            // this.cmn.presentAlert(resp.status);
          }
          localStorage.setItem("projectName", resp.objList.stateId);
          localStorage.setItem("siteId", resp.objList.flat.floor.block.site.id);
          localStorage.setItem("blockId", resp.flats[0].blockId);
          localStorage.setItem("flat_booking_id", resp.objList.flatBookingId);
          localStorage.setItem('flatNo', myflatids[0]?.flatNo || "");
          localStorage.setItem('appRegId', resp.appRegId);
          localStorage.setItem('mycustId', resp.custId);
          localStorage.setItem('Myflat_id', resp.flatIds[0]);
          localStorage.setItem('sessionkey', resp.sessionKey);
          localStorage.setItem('Myflat_Num', myflatids[0]?.flatNo || "");

          this.router.navigateByUrl("dashboard");
          break;
        case 600:
        case 700:
        default:
          this.clearMpin();
          this.cmn.presentAlert(resp.status);
          break;
      }

    } catch (err) {
      await this.loader.hideLoader();
      this.clearMpin();
      let msg = "Please try again after some time";
      if (err && typeof err === 'object' && 'status' in err && (err as any).status === 0) {
        msg = "Unable to connect to server, Something seems to be wrong.";
      }
      this.cmn.presentAlert(msg);
    }
  }


  resetMPIN() {
    this.mpin1 = this.mpin2 = this.mpin3 = this.mpin4 = '';
    this.mpin = ['', '', '', ''];
  }

  async showAlert(title: string, message: string, handlerFn?: () => void) {
    const alert = await this.alertCtrl.create({
      header: title,
      message,
      buttons: [{ text: 'OK', handler: handlerFn }]
    });
    await alert.present();
  }

  async showUpdateAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'SUMADHURA',
      message,
      buttons: [{
        text: 'Update',
        handler: () => {
          window.open('https://play.google.com/store/apps/details?id=com.app.sumadhura&hl=en', '_system');
          window.sessionStorage.clear();
          // App.exitApp();
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
  }


  clearMpin() {
    this.mpin = ['', '', '', ''];
  }

  async presentUpdateAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'SUMADHURA',
      message: msg,
      buttons: [{
        text: "Update",
        handler: () => {
          window.open('https://play.google.com/store/apps/details?id=com.app.sumadhura', '_system');
          sessionStorage.clear();
          // App.exitApp();
        }
      }],
      backdropDismiss: false
    });
    await alert.present();
  }

  async presentExitAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Sumadhura',
      message: msg,
      buttons: [{
        text: 'OK',
        handler: () => {
          // App.exitApp(); 
        }
      }]
    });
    await alert.present();
  }

  handleMultipleFlats(resp: any, myflatids: any[]) {
    localStorage.setItem("projectName", localStorage.getItem("projectName") || "");
    localStorage.setItem("appRegId", resp.appRegId);
    localStorage.setItem("flatsLength", myflatids.length.toString());
    localStorage.setItem("mycustId", resp.custId);
    localStorage.setItem("flats", JSON.stringify(myflatids));
    localStorage.setItem("flats_dashboard", myflatids[0].flatId);
    localStorage.setItem("flatNo", myflatids[0].flatNo);
    localStorage.setItem("sessionkey", resp.sessionKey);

    // const profileModal = this.modalCtrl.create(LoginpopupPage, { myflatids });
    // profileModal.present();
    this.common.presentAlert(resp.status);

    // profileModal.onDidDismiss(() => {
    //   const menu = document.querySelector('ion-menu');
    //   if (menu) menu['swipeEnable'] = true;
    //   this.menu.enable(true);
    // });
  }

  handleSingleFlat(resp: any, myflatids: any[]) {
    localStorage.setItem("projectName", resp.objList.stateId);
    localStorage.setItem("siteId", resp.objList.flat.floor.block.site.id);
    localStorage.setItem("blockId", resp.flats[0].blockId);
    localStorage.setItem("flat_booking_id", resp.objList.flatBookingId);
    localStorage.setItem("appRegId", resp.appRegId);
    localStorage.setItem("mycustId", resp.custId);
    localStorage.setItem("Myflat_id", resp.flatIds[0]);
    localStorage.setItem("Myflat_Num", myflatids[0].flatNo);
    localStorage.setItem("flatNo", myflatids[0].flatNo);
    localStorage.setItem("flatsLength", myflatids.length.toString());
    localStorage.setItem("sessionkey", resp.sessionKey);

    // this.events.publish('myEvent');
  }

}