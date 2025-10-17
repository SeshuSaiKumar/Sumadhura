import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { CommonModule } from '@angular/common';
import { App } from '@capacitor/app';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from 'src/app/common.service';
import { EventService } from 'src/app/event.service';
import { LoaderService } from 'src/app/LoaderService';
import { Network } from '@capacitor/network';
import { Route, Router } from '@angular/router';

declare var SMS: any;

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.page.html',
  styleUrls: ['./otp-verify.page.scss'],
})
export class OtpVerifyPage implements OnInit {

  @ViewChild('a') mpinInput1: any;
  @ViewChild('b') mpinInput2: any;
  @ViewChild('c') mpinInput3: any;
  @ViewChild('d') mpinInput4: any;
  @ViewChild('e') mpinInput5: any;
  @ViewChild('f') mpinInput6: any;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  mpin1: string;
  mpin2: string;
  mpin3: string;
  mpin4: string;
  mpin5: string;
  mpin6: string;
  totalmpin: string;
  otp_val: any;
  shortmobile: any;
  shortEmailIds: any;
  buttonDisabled: boolean = false;
  disconnectSubscription: any;
  timerText: string = '';
  mpin: string[] = ['', '', '', '', '', ''];
  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertcntrl: AlertController,
    public common: CommonService,
    public loader: LoaderService,
    private eventService: EventService,
    public modalCtrl: ModalController,
    public router: Router,
  ) {
    this.shortmobile = sessionStorage.getItem('tempmob_session');
    this.shortEmailIds = sessionStorage.getItem('emailidss_session');
  }
  ngOnInit() {

  }


  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      if (SMS) {
        SMS.startWatch(() => {
          console.log('SMS watching started');
        }, (error: any) => {
          console.log('Failed to start SMS watch:', error);
        });

        document.addEventListener('onSMSArrive', (e: any) => {
          const sms = e.data;
          console.log('SMS Arrived:', sms);

          if (sms.address.split('-')[1] === 'SUMAPP') {
            const OTPNUM = sms.body
              .split("Dear Customer, Welcome to Sumadhura customer app.")[1]
              .split(" is your OTP (One Time Password)")[0];

            this.mpin1 = OTPNUM[0];
            this.mpin2 = OTPNUM[1];
            this.mpin3 = OTPNUM[2];
            this.mpin4 = OTPNUM[3];
            this.mpin5 = OTPNUM[4];
            this.mpin6 = OTPNUM[5];
            // You may choose to call this.otpsubmission() here
          }
        });
      }
    });
  }

  moveFocus(nextElement: { setFocus: () => void; }, e: { keyCode: number; }, index: number) {
    if (e.keyCode === 8 && index !== 1) {
      const previousInputs = [this.mpinInput1, this.mpinInput2, this.mpinInput3, this.mpinInput4, this.mpinInput5];
      previousInputs[index - 2].setFocus();
    } else if (e.keyCode !== 8) {
      nextElement.setFocus();
    }
  }
  validateOTP() {
    const regex = /^[0-9]{0,6}$/; // Accept only numbers and allow up to 6 digits
    if (!regex.test(this.otp_val)) {
      this.otp_val = this.otp_val.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
    }
  }


  signup_two() {
    if (!this.mpin || this.mpin.every(val => val === '')) {
      this.common.presentAlert("OTP is required. Please enter the 6-digit code sent to your registered mobile number.");
      this.mpin = ['', '', '', '', '', ''];
      return false;
    }
    this.otpsubmission();
  }


  async otpsubmission() {
    const enteredMPIN = this.mpin.join("");
    console.log("Entered OTP:", enteredMPIN);

    // ✅ Validate empty input
    if (!enteredMPIN) {
      this.clearMpin();
      this.common.presentAlert("OTP cannot be empty. Please enter the 6-digit code sent to your mobile number.");
      return;
    }

    // ✅ Validate length
    if (enteredMPIN.length !== 6) {
      this.clearMpin();
      this.common.presentAlert("Invalid OTP. Please enter a 6-digit code.");
      return;
    }

    // ✅ Check network before API call
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return;
    }

    this.loader.showLoader();

    const url = this.common.commonservice + "registration/verifyOTP.spring";
    const options = {
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        sessionKey: localStorage.getItem('sessionKey'),
        otp: enteredMPIN
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      const resp = response.data;
      console.log(resp);
      this.loader.hideLoader();
      this.clearMpin();

      if (resp.responseCode === 545) {
        this.router.navigateByUrl('create-mpin').then(() => {
          this.common.presentAlert("OTP verified successfully!");
        });
      } else if (resp.responseCode === 546) {
        this.common.presentAlert("Incorrect OTP. Please try again.");

      } else if (resp.responseCode === 440) {
        this.common.presentAlert("Your session has expired. Please restart the signup process.");
        App.exitApp();

      } else {
        this.common.presentAlert(resp.status || "Something went wrong. Please try again.");
      }

    } catch (err) {
      this.loader.hideLoader();
      this.common.presentAlert("Unable to connect to the server. Please try again later.");
    }
  }



  clearMpin() {
    this.mpin1 = this.mpin2 = this.mpin3 = this.mpin4 = this.mpin5 = this.mpin6 = "";
  }

  resendOtpservicecalling() {
    this.buttonDisabled = true;
    this.resendotp();
  }


  async resendotp() {
    // ✅ Check network before API call
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return;
    }

    this.loader.showLoader();

    const url = this.common.commonservice + "registration/resendOTP.spring";

    const options = {
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "sessionKey": localStorage.getItem('sessionKey'),
        "mobileNo": localStorage.getItem('mobilenum_session'),
        "emails": [localStorage.getItem('emails_session')]
      }
    };

    console.log("Resend OTP Request:", options);

    try {
      const response = await CapacitorHttp.post(options);
      const resp = response.data;

      this.loader.hideLoader();
      this.startTimer(); // restart OTP timer if applicable

      if ([534, 539, 540, 600, 700].includes(resp.responseCode)) {
        this.common.presentAlert(resp.status);
      } else {
        this.common.presentAlert("Unable to resend OTP at the moment. Please try again later.");
      }

    } catch (err) {
      this.loader.hideLoader();
      this.common.presentAlert("Network error. Unable to resend OTP. Please check your connection and try again.");
    }
  }




  startTimer() {
    let time = 60; // 60 seconds
    this.timerText = `${Math.floor(time / 60)}:${('0' + (time % 60)).slice(-2)}`;

    const interval = setInterval(() => {
      time--;
      this.timerText = `${Math.floor(time / 60)}:${('0' + (time % 60)).slice(-2)}`;
      if (time <= 0) {
        clearInterval(interval);
        this.buttonDisabled = false;
        this.timerText = ''; // or 'Now'
      }
    }, 1000);
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

}

