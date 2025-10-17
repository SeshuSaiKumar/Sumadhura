import { Component, OnInit } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
interface MessengerDetailsPojo {
  viewDetails?: string;
  [key: string]: any;
}
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
 messengerlist: any = [];
  searchTerm: string = '';
  backbuttonPage: any;
  controller: Array<any> = [];
  count: number = 0;
  filterTerm: string = '';



  constructor( private modalCtrl: ModalController,
    private loadingCtrl: LoaderService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private common: CommonService,) { 

    this.filterTerm = sessionStorage.getItem("filtersearch") || '';
  }

  ngOnInit() {
    this.getMessengerList();
    this.backbuttonPage = sessionStorage.getItem("backbuttonpage");
  }



async getMessengerList() {
  await this.loadingCtrl.showLoader();  // Assuming showLoader returns a Promise

  const url = this.common.commonservice + "messenger/getMessagesList.spring";
  const body = {
    deviceToken: localStorage.getItem("deviceTokenId") || '',
    sessionKey: localStorage.getItem('sessionkey') || '',
    requestUrl: "getMessagesList",
    flatIds: [localStorage.getItem('Myflat_id')],
    type: "customer"
  };

  const options = {
    url,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    data: body
  };

  try {
    const response = await CapacitorHttp.post(options);
    await this.loadingCtrl.hideLoader();

    const data = response.data;

    if (data.responseCode === 200) {
      this.messengerlist = data.messengerDetailsPojos || [];
      this.controller = this.messengerlist.filter((item: MessengerDetailsPojo) => item.viewDetails === "NOT_VIEWED");
      this.count = this.controller.length;

      if (this.count === 0) {
        // Optional compatibility call
        // this.service.Inbox_sendNumber(0);
      }
    } else {
      this.common.presentAlert(data.status || "Something went wrong! Please try again");
    }
  } catch (err: any) {
    await this.loadingCtrl.hideLoader();
    const msg = err?.message || "Please try again after some time";
    this.common.presentAlert(msg);
  }
}


  async doRefresh(event: any) {
    await this.getMessengerList();
    event.target.complete();
  }

  // async imageView(myImage: string) {
  //   const modal = await this.modalCtrl.create({
  //     component: ViewerModalComponent,
  //     componentProps: {
  //       src: myImage
  //     },
  //     cssClass: 'ion-img-viewer',
  //     keyboardClose: true,
  //     showBackdrop: true
  //   });
  //   await modal.present();
  // }

  async goToViewPage(data: any) {
    sessionStorage.setItem("filtersearch", this.filterTerm);
    sessionStorage.removeItem("messengerdetailsTabsession");
    // navigate to details page (adjust router according to your setup)
  }

  goBack() {
    // use Angular Router to navigate
    // this.router.navigate(['dashboard-grids'], { replaceUrl: true });
  }

  // filter_fun() {
  //   this.modalCtrl.create({
  //     component: InboxModelPage
  //   }).then(modal => modal.present());
  // }
}
