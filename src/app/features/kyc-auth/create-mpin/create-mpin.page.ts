import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { Push } from '@capacitor/push-notifications'; // Import Push from the appropriate library
import { Device } from '@capacitor/device';
import { AlertController, LoadingController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-create-mpin',
  templateUrl: './create-mpin.page.html',
  styleUrls: ['./create-mpin.page.scss'],
})
export class CreateMpinPage implements OnInit {

  mpin1: string;
  mpin2: string;
  mpin3: string;
  mpin4: string;
  totalmpin: string;
  @ViewChild('a') mpinInput1: any;
  @ViewChild('b') mpinInput2: any;
  @ViewChild('c') mpinInput3: any;
  @ViewChild('d') mpinInput4: any;
  @ViewChild('e') mpinInput5: any;
  @ViewChild('f') mpinInput6: any;
  @ViewChild('g') mpinInput7: any;
  @ViewChild('h') mpinInput8: ElementRef;

  @ViewChild('firstName') firstNameElement: ElementRef;
  cnmpin1: any;
  cnmpin2: any;
  cnmpin3: string;
  cnmpin4: string;
  disconnectSubscription: any;
  deviceInfo: any = {};

  constructor(
    // private push: Push,
    public ajaxCall: CommonService,
    // private device: Device,
    private loadingCtrl: LoaderService,
    private modalCtrl: ModalController,
    private cmn: CommonService,
    // public navCtrl: NavController,
    // public navParams: NavParams,
    private router: Router,
    private alertController: AlertController,
    public platform: Platform,

  ) {
    // this.getDeviceInfo();


  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SinupSetpin3Page');
  }
  async getDeviceInfo() {
    const info = await Device.getInfo();
    const id = await Device.getId();

    this.deviceInfo = {
      uuid: id.identifier,
      model: info.model,
      platform: info.platform,
      version: info.osVersion,
      serial: 'N/A',
    };
    console.log('Device Info:', this.deviceInfo);

  }
  checkFocus() {
    // this.isShown = false
    //  this.hidegrid = false;
  }
  moveFocus(nextElement: { setFocus: () => void; }, e: { keyCode: number; }, index: number) {
    // Check if backspace key is pressed (keyCode 8) and the current index is not 1
    if (e.keyCode === 8 && index !== 1) {
      // Focus the previous input element based on the index
      if (index === 2) {
        this.mpinInput1.setFocus();
      }
      if (index === 3) {
        this.mpinInput2.setFocus();
      }
      if (index === 4) {
        this.mpinInput3.setFocus();
      }
      if (index === 5) {
        this.mpinInput4.setFocus();
      }
      if (index === 6) {
        this.mpinInput5.setFocus();
      }
      if (index === 7) {
        this.mpinInput6.setFocus();
      }
      if (index === 8) {
        this.mpinInput7.setFocus();
      }
    }
    // If backspace is not pressed, move to the next element
    else if (e.keyCode !== 8) {
      nextElement.setFocus(); // Focus on the next element
    }
  }

  signup_three() {

    if (
      this.mpin1 == undefined ||
      this.mpin1 == 'undefined' ||
      this.mpin1 == '' ||
      this.mpin2 == undefined ||
      this.mpin2 == 'undefined' ||
      this.mpin2 == '' ||
      this.mpin3 == undefined ||
      this.mpin3 == 'undefined' ||
      this.mpin3 == '' ||
      this.mpin4 == undefined ||
      this.mpin4 == 'undefined' ||
      this.mpin4 == ''
    ) {
      this.cmn.presentAlert('Please ReEnter your MPIN');
      this.mpin1 = '';
      this.mpin2 = '';
      this.mpin3 = '';
      this.mpin4 = '';
      return false;
    }
    let filter_setmpin = /^[0-9]$/;
    if (!filter_setmpin.test(this.mpin1 && this.mpin2 && this.mpin3 && this.mpin4)) {
      this.cmn.presentAlert('Please enter valid MPIN number');
      this.mpin1 = '';
      this.mpin2 = '';
      this.mpin3 = '';
      this.mpin4 = '';
      return false;
    }
    if (!filter_setmpin.test(this.mpin1 || this.mpin2 || this.mpin3 || this.mpin4)) {
      this.cmn.presentAlert('Please enter valid MPIN number');
      this.mpin1 = '';
      this.mpin2 = '';
      this.mpin3 = '';
      this.mpin4 = '';
      return false;
    }
    if (!filter_setmpin.test(this.mpin2 || this.mpin3)) {
      this.cmn.presentAlert('Please enter valid MPIN number');
      this.mpin1 = '';
      this.mpin2 = '';
      this.mpin3 = '';
      this.mpin4 = '';
      return false;
    }
    if (
      this.cnmpin1 == undefined ||
      this.cnmpin1 == 'undefined' ||
      this.cnmpin1 == '' ||
      this.cnmpin2 == undefined ||
      this.cnmpin2 == 'undefined' ||
      this.cnmpin2 == '' ||
      this.cnmpin3 == undefined ||
      this.cnmpin3 == 'undefined' ||
      this.cnmpin3 == '' ||
      this.cnmpin4 == undefined ||
      this.cnmpin4 == 'undefined' ||
      this.cnmpin4 == ''
    ) {
      this.cmn.presentAlert('Please enter 4 digit confirm MPIN');
      this.cnmpin1 = '';
      this.cnmpin2 = '';
      this.cnmpin3 = '';
      this.cnmpin4 = '';
      return false;
    }
    let filter_cnfirmmpin = /^[0-9]$/;
    if (!filter_cnfirmmpin.test(this.cnmpin1 && this.cnmpin2 && this.cnmpin3 && this.cnmpin4)) {
      this.cmn.presentAlert('Please enter valid confirm MPIN number');
      this.cnmpin1 = '';
      this.cnmpin2 = '';
      this.cnmpin3 = '';
      this.cnmpin4 = '';
      return false;
    }
    if (!filter_cnfirmmpin.test(this.cnmpin1 || this.cnmpin2 || this.cnmpin3 || this.cnmpin4)) {
      this.cmn.presentAlert('Please enter valid confirm MPIN number');
      this.cnmpin1 = '';
      this.cnmpin2 = '';
      this.cnmpin3 = '';
      this.cnmpin4 = '';
      return false;
    }
    if (!filter_cnfirmmpin.test(this.cnmpin2 || this.cnmpin3)) {
      this.cmn.presentAlert('Please enter valid confirm MPIN number');
      this.cnmpin1 = '';
      this.cnmpin2 = '';
      this.cnmpin3 = '';
      this.cnmpin4 = '';
      return false;
    }
    if (this.mpin1 != this.cnmpin1 || this.mpin2 != this.cnmpin2 || this.mpin3 != this.cnmpin3 || this.mpin4 != this.cnmpin4) {
      this.cmn.presentAlert('MPIN and Confirm MPIN number should match');
      return false;
    }

    this.setmpin();
    //this.navCtrl.setRoot(LoginPage);
  }
  async setmpin() {
    this.totalmpin = `${this.mpin1}${this.mpin2}${this.mpin3}${this.mpin4}`;

    // 🔍 Check network before API call
    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }

    this.loadingCtrl.showLoader();

    const url = this.cmn.commonservice + "registration/setMpin.spring";

    const options = {
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        deviceToken: this.cmn.deviceToken,
        sessionKey: localStorage.getItem('sessionKey') || "null",
        mpin: this.totalmpin,
        custId: localStorage.getItem('mycustId'),
        device: {
          "deviceToken": this.cmn.deviceToken,
          "deviceModel": this.cmn.deviceModel,
          "appVersion": this.cmn.appVersion,
          "osType": this.cmn.osType,
          "osVersion": this.cmn.osVersion,
          "uuid": this.cmn.uuid,
          "serialNo": this.cmn.serialNo,

        }
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      const data = response.data;

      this.loadingCtrl.hideLoader();

      console.log('Response: ', data);

      if (data) {
        if (data.responseCode === 200) {
          const tempSession = sessionStorage.getItem('from_forgot_mpin');
          if (tempSession === "true") {
            localStorage.setItem('Myflat_id', '');
            localStorage.setItem('Myflat_Num', '');
            localStorage.setItem('flats', '');
            localStorage.setItem('flatsLength', '');
          }

          localStorage.setItem("afterpinnumber", "true");

          this.router.navigate(['/generate-mpin']).then(() => {
            this.cmn.presentAlert("MPIN set successfully! Please login again.");
          });

        } else if ([600, 700, 800].includes(data.responseCode)) {
          this.totalmpin = "";
          this.cmn.presentAlert(data.status);
        } else {
          this.cmn.presentAlert("Something went wrong. Please try again later.");
        }
      }

    } catch (err) {
      this.loadingCtrl.hideLoader();
      if (err && typeof err === 'object' && 'status' in err && (err as any).status === 0) {
        this.cmn.presentAlert("Unable to connect to server. Please check your internet connection.");
      } else {
        this.cmn.presentAlert("Server error. Please try again later.");
      }
      return false;
    }
  }

  MPIN_Policies_redirection() {
    // Create the modal for MPIN Policies page
    // let profileModal = this.modalCtrl.create({
    //   component: MpinPoliciesPage, // Reference to the MPIN Policies page
    //   cssClass: 'custom-policies-modal'  // 👈 Add your custom class

    // });

    // profileModal.then(modal => {
    //   modal.present(); // Display the modal
    // });
  }

}


