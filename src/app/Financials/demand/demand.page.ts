import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.page.html',
  styleUrls: ['./demand.page.scss'],
})
export class DemandPage implements OnInit {
  @ViewChild('fromDatePicker', { static: false }) fromDatePicker: any;
  @ViewChild('toDatePicker', { static: false }) toDatePicker: any;
  fromDate: string | null;
  toDate: string | null;
  showFromDatePicker: boolean = false;
  showToDatePicker: boolean = false;
  selectedFilter = 1;
  selectedFromDate: string | number | Date;
  selectedToDate: string | number | Date;
  tempSelectedDate: string = '';

  demandNotes: Array<any> = [];

  constructor(private router: Router,
    private fb: FormBuilder,
    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {
    this.demandNote_view();
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


  async demandNote_view() {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }

    // 2. Show loader
    this.loaderService.showLoader();

    // 3. Prepare API request
    const options = {
      url: this.common.commonservice + "financial/demandNoteDtls.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceId": this.common.deviceToken,
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
        this.demandNotes = [];
        this.demandNotes = response.data.demandNote;
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

  demandnotedownload(downloadurl :any){
    window.open(downloadurl, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
  }

}
