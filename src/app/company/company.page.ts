import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from '../common.service';
import { LoaderService } from '../LoaderService';
import { ProductService } from './product.service';
interface Notification {
  id: number;
  viewed: boolean;
  appRegId: any;
  logo: string;
  message: string;
  descriptionWithOutTags: string;
  createdDate: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
 searchText = '';
  selectedId = 4; // example: last card selected/active
  public count: number = 0;

dataArray: Notification[] = [];
  commnurl_notification: string;
  campdfImgs: any;
  isCompanyNotificationAvailable: any;
  disconnectSubscription: any;
  disabled: boolean;
  appRegId: any;
  backbutton_page: any;

  controller:Array<any> = [];

  constructor(private router: Router,private cmn: CommonService,private loaderService: LoaderService,public service: ProductService)
       {
  this.appRegId = localStorage.getItem('appRegId')
  console.log(this.appRegId,'appRegId');
  
    this.commnurl_notification  = "notification";
    // this.backbutton_page = sessionStorage.getItem("backbuttonpage")

    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => 
    //  {
    //    console.log('network was disconnected :-(');
    //  });
    }

   ngOnInit() {
         this.loadCompanyUpdates();

   }
  openDetail(update: any) {
    this.router.navigate(['/CompanyupdatesPage/company-view'], {
    queryParams: { ticket: JSON.stringify(update) }
  });
  }

async loadCompanyUpdates() {
await this.loaderService.showLoader();

  const url = this.cmn.commonservice + "notification/companysNotifys.spring";
  console.log(url);

  const body = {
    deviceId: localStorage.getItem("deviceTokenId") || "",
    customerId: localStorage.getItem("mycustId") || "",
    flatId: localStorage.getItem("Myflat_id") || "",
    sessionKey: localStorage.getItem("sessionkey") || ""
  };
  console.log("Body:" + JSON.stringify(body));

  try {
    const response = await CapacitorHttp.post({
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: body,
    });

    await this.loaderService.hideLoader();

    const resp = response.data;
    console.log("Notification list Data:", resp);

    if (resp.responseCode == 200) {
      this.dataArray = response.data.notificationResponses;
      console.log("Notification list Datasss:", this.dataArray);
      this.isCompanyNotificationAvailable = resp.isNotificationResponsesAvailable;

      this.controller = [];

      for (let i = 0; i < resp.notificationResponses.length; i++) {
        if (resp.notificationResponses[i].appRegId == this.appRegId) {
          if (resp.notificationResponses[i].viewed == false) {
            this.controller.push(resp.notificationResponses[i].viewed);
            this.service.notification_sendNumber(this.increament());
          }
        }
      }

      if (this.controller.length == 0) {
        this.service.notification_sendNumber(this.increament());
      }
            return false;

    } else if (resp.responseCode == 440) {
      this.cmn.presentAlert(resp.status);
      return false;
    }

  } catch (err: any) {
    await this.loaderService.hideLoader();

    if (err.status === 0) {
      this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
    } else {
      this.cmn.presentAlert("Please try again after some time");
    }
    return false;
  }
}
increament() {
    if(this.controller.length == 0){
      return 0;
    } else {
      this.count = this.controller.length;
      console.log(this.count);
      return this.count;
    }
    
  }
  
}