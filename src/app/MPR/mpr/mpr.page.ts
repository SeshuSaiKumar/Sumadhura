import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { LoadingController, MenuController, Platform, IonRouterOutlet } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-mpr',
  templateUrl: './mpr.page.html',
  styleUrls: ['./mpr.page.scss'],
})
export class MprPage implements OnInit {
  filterKeys = ['mprName'];
  search: any;
  mpr_list: Array<any> = [];
  appRegId: string | null;

  constructor(private router: Router,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {
    this.appRegId = localStorage.getItem('appRegId')
    this.faqListFun();

  }

  ngOnInit() {
  }

  async faqListFun() {
    try {
      // 1. Check internet
      const status = await Network.getStatus();
      if (!status.connected) {
        this.common.presentAlert("No internet connection. Please check your network and try again.");
        return false;
      }

      // 2. Show loader
      this.loaderService.showLoader();

      // 3. Prepare API request
      const options = {
        url: this.common.commonservice + "mpr/getCustomerMPRDetails.spring",
        headers: { 'Content-Type': 'application/json' },
        data: {
          deviceToken: this.common.deviceToken,
          sessionKey: localStorage.getItem("sessionkey"),
        },
      };

      console.log("URL:", options.url);
      console.log("Body:", options.data);

      // 4. API call
      const response = await CapacitorHttp.post(options);
      console.log("Response:", response.data);

      if (response.data.responseCode === 200) {
        this.mpr_list = response.data.responseObjList?.mprResponseList || [];
        console.log(this.mpr_list);
        return true;
      }

      if ([440, 600, 700].includes(response.data.responseCode)) {
        this.common.presentAlert(response.data.status || "Session expired or invalid request.");
        return false;
      }

      this.common.presentAlert("Something went wrong! Please try again.");
      return false;

    } catch (err: any) {
      console.error("API Error:", err);

      if (err.status === 0) {
        this.common.presentAlert("Unable to connect to server, Something seems to be wrong.");
      } else {
        this.common.presentAlert("Please try again after some time.");
      }
      return false;

    } finally {
      // Always hide loader
      this.loaderService.hideLoader();
    }
  }
  statusChnge(item: any, devices: any[]) {
    console.log("Item:", JSON.stringify(item));
    console.log("Devices:", devices);

    if (!devices?.length) {
      return;
    }

    // Find the device entry for the current user
    const myDevice = devices.find(d => d.appRegId === this.appRegId);

    if (myDevice) {
      console.log("Matched Device:", myDevice);

      if (!myDevice.viewStatus) {
        this.forstatuschange(item.mprId);
      }
    } else {
      console.log("No matching device found for appRegId:", this.appRegId);
      // 👉 if you want to change status anyway when no match, uncomment below
      // this.forstatuschange(item.mprId);
    }
  }



  myUrl(fileurl: any) {
    window.open(fileurl, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
  }

  async forstatuschange(mprId: string) {
    try {
      // 1. Check internet
      const status = await Network.getStatus();
      if (!status.connected) {
        this.common.presentAlert("No internet connection. Please check your network and try again.");
        return false;
      }

      // 2. Show loader
      this.loaderService.showLoader();

      // 3. Prepare API request
      const options = {
        url: `${this.common.commonservice}mpr/saveMPRViewStatus.spring`,
        headers: { "Content-Type": "application/json" },
        data: {
          id: mprId,
          deviceToken: this.common.deviceToken,
          sessionKey: localStorage.getItem("sessionkey") || "",
        },
      };

      console.log("API Request:", options);

      // 4. API call
      const { data } = await CapacitorHttp.post(options);
      console.log("API Response:", data);

      if (data.responseCode === 200) {
        await this.faqListFun(); // refresh list
        return true;
      }

      if ([440, 600, 700].includes(data.responseCode)) {
        this.common.presentAlert(data.status || "Session expired or invalid request.");
        return false;
      }

      this.common.presentAlert("Something went wrong! Please try again.");
      return false;

    } catch (err: any) {
      console.error("API Error:", err);

      if (err.status === 0) {
        this.common.presentAlert("Unable to connect to server, Something seems to be wrong.");
      } else {
        this.common.presentAlert("Please try again after some time.");
      }
      return false;

    } finally {
      // Always hide loader
      this.loaderService.hideLoader();
    }
  }


}
