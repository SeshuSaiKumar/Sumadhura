import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, IonRouterOutlet, LoadingController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { CapacitorHttp, Plugins } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/LoaderService';
import { PanNumberDoubleFlatModelPage } from '../pan-number-double-flat-model/pan-number-double-flat-model.page';

@Component({
  selector: 'app-pan-entry',
  templateUrl: './pan-entry.page.html',
  styleUrls: ['./pan-entry.page.scss'],
})
export class PanEntryPage implements OnInit {
  pan_num: string = '';
  deviceInfo: any = {};
  networkListener: any;
  constructor(
    public route: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private alertController: AlertController,
    private modalCtrl: ModalController

  ) {

  }

  async ngOnInit() {


  }

  ngOnDestroy() {

  }
  validatePan(): boolean {
    const panFormat = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (!this.pan_num) {
      this.common.presentAlert("Please enter your 10-digit PAN number. Example: ABCDE1234F");
      return false;
    }
    if (this.pan_num.length < 10 || !panFormat.test(this.pan_num.toUpperCase())) {
      this.common.presentAlert("The PAN you entered is not valid. It should be 5 letters, 4 digits, and 1 letter. Example: ABCDE1234F");
      return false;
    }
    return true;
  }
  // panvalidation(event: any) {
  //   this.pan_num = event.target.value.toUpperCase();
  //   if (this.pan_num.length > 10) {
  //     this.pan_num = this.pan_num.slice(0, 10);
  //     return;
  //   }
  //   if (this.pan_num.length === 10) {
  //     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //     if (!panRegex.test(this.pan_num)) {
  //       this.common.presentAlert("PAN must be in the format: 5 letters, 4 digits, and 1 letter. Example: ABCDE1234F"
  //       );
  //       this.pan_num = "";
  //       return false;
  //     } else {
  //       // this.common.presentToast("✅ PAN looks valid!");
  //     }
  //   }
  // }
 panvalidation(event: any) {
  const rawValue = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  // Only take first 10 characters
  this.pan_num = rawValue.slice(0, 10);

  if (this.pan_num.length === 10) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(this.pan_num)) {
      this.common.presentAlert("PAN must be in the format: 5 letters, 4 digits, and 1 letter. Example: ABCDE1234F");
      this.pan_num = "";
      return false;
    }
  }
}
  async signup_one() {
    if (!this.validatePan()) return;

    const status = await Network.getStatus();
    if (!status.connected) {
      await this.common.NetworkpresentAlert(true); // Show "No Internet"
      return false; // stop here, don't call backend
    }
    this.loaderService.showLoader();
    const options = {
      url: this.common.commonservice + "registration/customerRegistration.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        pancard: this.pan_num,
        device: {
          "deviceToken": this.common.deviceToken,
          "deviceModel": this.common.deviceModel,
          "appVersion": this.common.appVersion,
          "osType": this.common.osType,
          "osVersion": this.common.osVersion,
          "uuid": this.common.uuid,
          "serialNo": this.common.serialNo,
        }
      }

    };

    console.log(options.url);
    console.log(JSON.stringify(options.data));
    return CapacitorHttp.post(options).then(async (response) => {
      this.loaderService.hideLoader();
      const resp = response.data;
      console.log(resp);
      const errorCodes = ["531", "533", "539", "540", "600", "700", "544", "543", "542", "541"];
      if (errorCodes.includes(resp.responseCode)) {
        this.pan_num = "";
        this.common.presentAlert(resp.status);
        return false;
      }
      if (resp.responseCode === 532) {
        localStorage.setItem('mycustId', resp.custId);

        const modal = await this.modalCtrl.create({
          component: PanNumberDoubleFlatModelPage,
          componentProps: {
            model_data: resp.mobileNos,
            model_emailIDS: resp.emails,
            model_custId: resp.custId
          },
          cssClass: 'custom-signup-modal'
        });

        await modal.present();
        // this.common.presentAlert(resp.status);

        modal.onWillDismiss().then((dataReturned) => {
          if (dataReturned?.data?.page === 'RegistrationPage') {
            this.route.navigateByUrl("otp-verify");
          }
        });
        return true;
      }

      // 🟢 Case 534 → PAN valid → navigate to registration
      if (resp.responseCode === 534) {
        const maskedNum = "*".repeat(resp.mobileNo.length - 3) + resp.mobileNo.slice(-3);
        sessionStorage.setItem('tempmob_session', maskedNum);
        sessionStorage.setItem('emailidss_session', resp.emails);
        localStorage.setItem('mobilenum_session', resp.mobileNo);
        localStorage.setItem('session_key', resp.sessionKey);
        localStorage.setItem('emails_session', resp.emails);
        localStorage.setItem('mycustId', resp.custId);
        this.common.presentAlert(resp.status);

        this.route.navigateByUrl("otp-verify");
        return true;
      }
      this.pan_num = "";
      this.common.presentAlert(resp.status);
      return false;
    })
      .catch(async (err) => {
        this.loaderService.hideLoader();
        console.error("PAN API Error:", err);

        // 🔴 If network lost during call
        const status = await Network.getStatus();
        if (!status.connected) {
          await this.common.NetworkpresentAlert(true);
        } else {
          this.common.presentAlert("Something went wrong. Please try again later.");
        }
        return false;
      });



  }


  async redirectToPolicies() {
    console.log("welcome");
    this.route.navigateByUrl("privacy-policy");

  }
}

