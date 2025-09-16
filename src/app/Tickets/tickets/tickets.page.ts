import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
// import { NetworkPlugin } from '@capacitor/network';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  @ViewChild('groupmodal', { static: false }) groupmodal: any;
    activeSegment = 'all';
  ticketslist: any;
  refresh_data: boolean = false;
  resolutionDay_Time: any;
  StatusChanged: any;
  purpose_name: any
  mypurposeres: any;
  purposetype: any;
  mySubPurposeType: any = [];
  subpurposetype: any;
  sub_purpose_name: any;
  ticketType: string;
  array: any = [];
    mesag: any;
  public fileInfo: any = [];

  constructor(
      // public ajaxCall: CommonService,
      // private device: Device,
      // private network: NetworkPlugin,
      // private iab: InAppBrowser,
      private loaderService: LoaderService,
      private modalCtrl: ModalController,
      private cmn: CommonService,
      public navCtrl: NavController,
      // public navParams: NavParams,
      private router: Router,
      private alertController: AlertController,
      public platform: Platform,) { }


  ngOnInit() {
    this.myTicketsList()
        this.purposeType();

  }
  groupmdl() {

      this.groupmodal.present();
    }

    
  dismissModal() {
    this.groupmodal.dismiss();
  }
 gotoTicketDetails(ticket: any) {
  this.router.navigate(['/view-ticket'], {
    queryParams: { ticket: JSON.stringify(ticket) }
  });
}


  async myTicketsList() {
  this.loaderService.showLoader();

  const options = {
    url: this.cmn.commonservice + "customerTicket/getCustomerRaisedTicketList.spring",
    headers: { 'Content-Type': 'application/json' },
    data: {
      deviceToken: this.cmn.deviceToken,
      sessionKey: localStorage.getItem("sessionkey") || ''
    }
  };

  try {
    const response = await CapacitorHttp.post(options);
    this.loaderService.hideLoader();

    // The CapacitorHttp plugin returns response.data as a string, so parse if needed
    let resp = response.data;
    if (typeof resp === 'string') {
      resp = JSON.parse(resp);
    }

    if (resp.responseCode === 200) {
      this.ticketslist = resp.ticketResponseList;
        console.log(resp);
                  this.mesag = "";

      if (this.refresh_data === true) {
        const currentCount = localStorage.getItem("demo");
        const newCount = resp.ticketResponseList.length;

        // if (currentCount === null) {
        //   this.ticket = "mt";
        // } else if (newCount > parseInt(currentCount)) {
        //   this.ticket = "rk";

          // this.purposetype = "";
          // this.subpurposetype = "";
          // this.mySubPurposeType = "";
        //   this.mesag = "";
        //   this.photos = [];
        //   this.sendfile = [];
          this.fileInfo = [];
        //   this.file_extension = [];
        //   this.myfiles = [];
        //   this.cameragallery_extension = [];
        //   this.controllerdata = [];
        //   this.array = [];
        //   this.cameragallery = [];
        //   this.uploader.queue = [];
        //   this.resultoftwoarray = [];
        //   this.maincontroller = [];
        //   this.hidepdf = true;
        //   this.hideimg = true;
        // } else {
        //   this.ticket = "mt";
        // }

        localStorage.setItem("demo", newCount.toString());
      }

      // if (this.from_previous_page === "true") {
      //   this.ticket = "rk";
      // }

    } else if (resp.responseCode === 440) {
      this.cmn.presentAlert(resp.status);
      // this.platform.exitApp();
      return false;
    } else {
      // Handle other errors if needed
      // this.cmn.commonAlertfun("something went wrong! Please try again");
    }

  } catch (err) {
  this.loaderService.hideLoader();

  const error = err as { status?: number };

  if (error.status === 0) {
    this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
    return false;
  }

  this.cmn.presentAlert("Please try again after some time");
  return false;
}
  }

  async purposeType() {
  // // const loader = await this.loadingCtrl.create({});
  // await loader.present();

  const url = this.cmn.commonservice + "customerTicket/getTicketTypeDetails.spring";

  const body = {
    "sessionKey": localStorage.getItem('sessionkey'),
    "deviceToken": localStorage.getItem("deviceTokenId"),
  };

  const options = {
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: body
  };

  try {
    const response = await CapacitorHttp.post(options);
    console.log("purpose type :" + JSON.stringify(response.data));
    // await loader.dismiss();

    if (response.data.responseCode == 200) {
      let mydata = JSON.stringify(response.data);
      this.mypurposeres = response.data.ticketTypeResponses;
    } else {
      this.cmn.presentAlert(response.data.status);
      // this.getTicketDetails();
    }
    // Optionally handle resolution time here
    // sessionStorage.setItem('resoluation_time', response.data.ticketTypeResponses.resolutionDayTime);
  } catch (err) {
    // await loader.dismiss();
    // this.cmn.commonAlertfun("Error in retrieving the data");
    return false;
  }
}
purposeChange(event: any) {
  const value = event.detail.value; // 'item' object from purposetype select
  console.log("Purpose Changed:", value);
  this.purposetype = value;
  this.mySubPurposeType = value.ticketTypeResponseList;
  console.log("Sub Purpose Options:", this.mySubPurposeType);
  
  this.purpose_name = value.ticketMainType;
  // If needed, trigger sub-purpose population here using value.ticketMainType or value.ticketTypeId
}

onchange(event: any) {
  const value = event.detail.value; // comma-separated string from subpurposetype select
  console.log("Sub Purpose Changed:", value);
  if (value) {
    const parts = value.split(',');
    this.StatusChanged = parts;           // ticketTypeId
    this.sub_purpose_name = parts[3];        // ticketType
    this.resolutionDay_Time = parts[4];      // resolutionDayTime
    this.ticketType = (this.purposetype.ticketMainType || "") + " / " + this.sub_purpose_name;
  }
}

submitFun() {
    // alert(this.resultoftwoarray.length);
    this.fileInfo = [];
    let prop_type = this.purposetype;
    if (prop_type == "" || prop_type == undefined) {
      this.cmn.presentAlert("Please choose your query");
      return false;
    }

    let sub_purp_type = this.subpurposetype;
    if (sub_purp_type == "" || sub_purp_type == undefined) {
      this.cmn.presentAlert("Please select specifics");
      return false;
    }

    let message = this.mesag;
    if (message == "" || message == undefined) {
      this.cmn.presentAlert("Please enter the comments");
      return false;
    }
    if (message.length > 2000) {
      this.cmn.presentAlert("Your comments should be less than 2000 characters.");
      return false;
    }
  }

async uploadWebFun() {
  let prop_type = this.purposetype;
  if (!prop_type) {
    this.cmn.presentAlert("Please choose your query");
    return false;
  }

  let sub_purp_type = this.subpurposetype;
  if (!sub_purp_type) {
    this.cmn.presentAlert("Please select specifics");
    return false;
  }

  let message = this.mesag;
  if (!message) {
    this.cmn.presentAlert("Please enter the comments");
    return false;
  }
  if (message.length > 2000) {
    this.cmn.presentAlert("Your comments should be less than 2000 characters.");
    return false;
  }

  const params = {
    sessionKey: localStorage.getItem('sessionkey_afterlogin'),
    deviceToken: localStorage.getItem("deviceTokenId"),
    ticketTypeId: this.StatusChanged,
    title: this.ticketType,
    description: this.mesag,
    resolutionDayTime: this.resolutionDay_Time,
    type: this.purpose_name,
    subtype: this.sub_purpose_name
  };

  const encodedParams = btoa(JSON.stringify(params));
  const secureUrl = this.cmn.commonservice + `?token=${encodedParams}`;

  // Optional: If backend expects a POST, use CapacitorHttp first
  // let response = await CapacitorHttp.post({
  //   url: this.cmn.commonservice,
  //   headers: { 'Content-Type': 'application/json' },
  //   data: params
  // });

  // Open popup using Capacitor Browser plugin
  await Browser.open({ url: secureUrl });

  // For refresh logic after browser closes, use Browser events
  Browser.addListener('browserFinished', () => {
    console.log('Popup browser closed');
    this.myTicketsList();
    this.refresh_data = true;
  });
this.modalCtrl.dismiss();
}


}