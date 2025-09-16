import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController, ModalController } from '@ionic/angular';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';



@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {
  @ViewChild('fromDatePicker', { static: false }) fromDatePicker: any;
  @ViewChild('toDatePicker', { static: false }) toDatePicker: any;
  @ViewChild('productModal_new', { static: false }) productModal_new: any;
  fromDate: string | null;
  toDate: string | null;
  showFromDatePicker: boolean = false;
  showToDatePicker: boolean = false;
  selectedFilter = 1;
  itemData: any;
  selectedFromDate: string | number | Date;
  selectedToDate: string | number | Date;
  tempSelectedDate: string = '';
  // demandNotes = [
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },
  //   { number: 'DN15246225SS', date: '2024-10-24' },

  // ];

  demandNotes: Array<any> = [];
  controller: any;
  constructor(private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder, private modalCtrl: ModalController,
    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {

    this.route.queryParams.subscribe(params => {

      if (params['items']) {
        this.itemData = JSON.parse(params['items']);
        console.log(this.itemData);
      }
    });

    this.receipt_view();
  }

  ngOnInit() {
  }

  selectQuickFilter(months: number) {
    this.selectedFilter = months;
  }

  toggleFromDatePicker() {
    this.showToDatePicker = false;
    this.fromDatePicker.present()

  }

  toggleToDatePicker() {
    this.showFromDatePicker = false;
    this.toDatePicker.present()
  }

  updateFromDate(event: any) {
    this.selectedFromDate = event.detail.value;
    this.showFromDatePicker = false;
    if (this.selectedToDate && new Date(this.selectedFromDate) > new Date(this.selectedToDate)) {
      this.common.presentAlert('From Date cannot be later than To Date');
      this.selectedFromDate = '';
      this.selectedToDate = '';
    } else {
    }
  }

  updateToDate(event: any) {
    this.selectedToDate = event.detail.value;
    this.showToDatePicker = false;
    if (this.selectedFromDate && new Date(this.selectedFromDate) > new Date(this.selectedToDate)) {
      this.common.presentAlert('From Date cannot be later than To Date');
      this.selectedFromDate = '';
      this.selectedToDate = '';
    } else {
    }
  }


  async receipt_view() {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }

    // 2. Show loader
    this.loaderService.showLoader();

    // 3. Prepare API request
    const options: any = {
      url: this.common.commonservice + "financial/paymentDtls.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceId": this.common.deviceToken,
        "sessionKey": localStorage.getItem("sessionkey_afterlogin"),
      }
    };

    //  If paymentScheduleId is available, extend the body
    if (this.itemData.paymentScheduleId !== undefined) {
      Object.assign(options.data, {
        paymentScheduleId: this.itemData.paymentScheduleId,
        paymentStatusId: this.itemData.paymentStatusId,
        payStgMapId: this.itemData.payStgMapId
      });
    }

    console.log("Request Options:", options);


    console.log("URL:", options.url);
    console.log("Body:", options.data);

    // 4. API call
    return CapacitorHttp.post(options).then(response => {
      console.log("Response:", response.data);

      this.loaderService.hideLoader();

      if (response.data.responseCode == 200) {
        this.demandNotes = [];
        this.demandNotes = response.data.paymentDetailsList;
        console.log(this.demandNotes);

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


  async receipt_redirection(data: any) {
    this.controller = data;
    console.log(this.controller);
    this.productModal_new.present();
  }


  model_close_fun() {
    this.productModal_new.dismiss();
  }

  openFile(filePath: string) {
    if (!filePath) {
      console.log('No file available');
      return;
    }
    window.open(filePath, '_blank'); // opens in browser / download
  }


  async consolidatedreceipturl() { 

     const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }

    // 2. Show loader
    this.loaderService.showLoader();

    // 3. Prepare API request
    const options = {
      url: this.common.commonservice + "financial/generateConsolidatedReceipt.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "sessionKey": localStorage.getItem("sessionkey_afterlogin"),
      },
    };

    console.log("URL:", options.url);
    console.log("Body:", options.data);

    // 4. API call
    return CapacitorHttp.post(options).then(response => {
      console.log("Response:", response.data);

      this.loaderService.hideLoader();

      if (response.data.responseCode == 200) {
       window.open(response.data.responseObjList.fileInfoList[0].url, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
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


}
