import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { LoaderService } from '../LoaderService';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-change',
  templateUrl: './change.page.html',
  styleUrls: ['./change.page.scss'],
})
export class ChangePage implements OnInit {

  OTP: any = [];
  confirm_OTP: any = [];

  New_OTP: any = [];
  controller: any;
  mobile: any;
  otp_controller: any;

  loginhere: boolean | any;
  otp_new_controller: string | any;
  route: any | undefined;

  constructor(private router: Router,
    private fb: FormBuilder,

    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,) {

    document.addEventListener("backbutton", () => {

      if (this.router.url == "/changepassword") {
        this.router.navigate(['/user-creation'], {
          queryParams: {
            profile: "Profile"
          }
        });
      }



    });




  }

  ngOnInit() {
  }




  closefun() {

    this.router.navigate(['/user-creation'], {
      queryParams: {
        profile: "Profile"
      }
    });




  }


  otpController(event: any, next: any, prev: any, index: any) {

    const newValue = event.target.value;
    const regExp = new RegExp(/^\d+$/);
    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      this.mobile = event.target.value;
    } else if (index == 4) {
      this.controller = true;
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }

  }



  new_otpController(event: any, next: any, prev: any, index: any) {

    const newValue = event.target.value;
    const regExp = new RegExp(/^\d+$/);
    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      this.mobile = event.target.value;
    } else if (index == 4) {
      this.controller = true;
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }

  }





  confirm_otpController(event: any, next: any, prev: any, index: any) {

    const newValue = event.target.value;
    const regExp = new RegExp(/^\d+$/);
    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      this.mobile = event.target.value;
    } else if (index == 8) {
      this.controller = true;
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }

  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }


  async submitfun() {

    this.otp_controller = "";
    for (var i = 0; i < this.OTP.length; i++) {
      this.otp_controller += this.OTP[i];
    }


    this.otp_new_controller = "";
    for (var i = 0; i < this.New_OTP.length; i++) {
      this.otp_new_controller += this.New_OTP[i];
    }

    if (this.OTP.length !== 4) {
      this.common.presentAlert('Please enter a 4-digit current pin number');
    } else if (this.New_OTP.length !== 4) {
      this.common.presentAlert('Please enter a 4-digit new pin number');
    }
    else if (this.confirm_OTP.length == 0 || this.confirm_OTP.length !== 4) {
      this.common.presentAlert('Please enter a 4-digit confirm pin number');
    } else if (this.New_OTP.length != this.confirm_OTP.length) {
      this.common.presentAlert('Please enter a 4-digit pin number');
    } else {
      if (this.New_OTP.join('|') === this.confirm_OTP.join('|')) {


        const status = await Network.getStatus();
        if (!status.connected) {
          this.common.presentAlert("No internet connection. Please check your network and try again.");
          return false;
        }

        this.loaderService.showLoader();
        const options = {
          url: this.common.commonservice + "login/changeMpin.spring",
          headers: { 'Content-Type': 'application/json' },
          data: {
            "deviceId": this.common.deviceToken,
            "sessionKey": localStorage.getItem("sessionkey"),
            "empId": localStorage.getItem('mpinhandle'),
            "newMpin": this.otp_new_controller,
            "oldMpin": this.otp_controller,
            "uuid": this.common.uuid,
            "serialNo": this.common.serialNo,
          },
        };

        console.log(options.url);
        console.log(options.data);

        return CapacitorHttp.post(options).then(response => {
          console.log(response.data);
          if (response.data.responseCode == 200) {
            this.loaderService.hideLoader();

            this.common.presentAlert(response.data.description);
            this.router.navigate(['/dashboard'], {
              queryParams: {
                profile: "Profile"
              }
            });
            return false;
          } else if (response.data.responseCode == 700) {
            this.loaderService.hideLoader();
            this.common.presentAlert(response.data.errors[0]);
            return false;
          } else if (response.data.responseCode == 800) {
            this.loaderService.hideLoader();
            this.common.presentAlert(response.data.errors[0]);
            return false;
          } else {
            this.loaderService.hideLoader();
            this.common.presentAlert(response.data.errors[0]);
            return false;
          }
        }).catch(err => {
          this.loaderService.hideLoader();
          this.common.presentAlert('Internal server error.');
          return false;
        });

      } else {
        this.common.presentAlert(' MPIN must match');

      }
    }
  }


}

