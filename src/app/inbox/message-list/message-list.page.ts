import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {

  filterKeys = ['subject', 'chatMsgWithoutTags', 'lastChattedDate', 'departmentName'];
  messengerlist: Array<any> = [];
  search: any;
  constructor(private router: Router,
    private fb: FormBuilder,
    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {
    this.getMessagerlist();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
   
  }

  /*------------------------------------------Faq list start--------------------------*/
  async getMessagerlist() {
    // 1. Check internet
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }

    // 2. Show loader
    this.loaderService.showLoader();
    const sessionKey = localStorage.getItem('sessionkey_afterlogin') ?? '';
    const flatId = localStorage.getItem('Myflat_id');
    // 3. Prepare API request
    const options = {
      url: this.common.commonservice + "messenger/getMessagesList.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "sessionKey": sessionKey,
        "requestUrl": "getMessagesList",
        "flatIds": flatId ? [flatId] : [],
        "type": "customer"
      },
    };

    console.log("URL:", options.url);
    console.log("Body:", options.data);

    // 4. API call
    return CapacitorHttp.post(options).then(response => {
      console.log("Response:", response.data);

      this.loaderService.hideLoader();

      if (response.data.responseCode == 200) {

        this.messengerlist = [];
        this.messengerlist = response.data.messengerDetailsPojos;

      } else if (response.data.responseCode == 440) {
        this.common.presentAlert(response.data.status);
        return false;
      } else if (response.data.responseCode == 600 || response.data.responseCode == 700) {
        this.common.presentAlert(response.data.status);
        return false;
      } else {
        this.common.presentAlert("Something went wrong! Please try again.");
        return false;
      }
    }).catch(err => {
      this.loaderService.hideLoader();

      if (err.status === 0) {
        this.common.presentAlert("Unable to connect to server, Something seems to be wrong.");
      } else {
        this.common.presentAlert("Please try again after some time.");
      }

      return false;
    });
  }
  /*------------------------------------------Faq list end--------------------------*/

  goToViewPage(data: any) {
    this.router.navigate(['/message-chat'], {
      queryParams: { item: JSON.stringify(data) }
    });
  }


}

