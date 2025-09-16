import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-upload-image-view',
  templateUrl: './upload-image-view.page.html',
  styleUrls: ['./upload-image-view.page.scss'],
})
export class UploadImageViewPage implements OnInit {
  uploaddocs: any;
  documentsAvailable: any;

  constructor(private router: Router,
    private fb: FormBuilder,
    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {
    this.Documents();
  }

  ngOnInit() {
  }

  async Documents() {
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
      url: this.common.commonservice1 + "uploadOrViewCustomerData/viewCustomerBinaryData.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "fileUploadedFrom": "SIDE_MENU",
        "siteId": localStorage.getItem("siteId"),
        "flatBookingId": localStorage.getItem("flat_booking_id"),
        "pageNo": "1",
        "pageSize": "10",
        "verifyMe": "SIDE_MENU"
      },
    };

    console.log("URL:", options.url);
    console.log("Body:", options.data);

    // 4. API call
    return CapacitorHttp.post(options).then(response => {
      console.log("Response:", response.data);

      this.loaderService.hideLoader();

      if (response.data.responseCode == 200) {
        this.uploaddocs = response.data.pdfDetails;
        this.documentsAvailable = response.data.responseObjList;
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

  getFileExtension(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf('.')).toLowerCase();
  }

  // Extract file name
  getFileName(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  }

  // Open / download file
  async downloadFile(fileUrl: string, item: any) {
    try {
      this.statusCall(item);
      await Browser.open({ url: fileUrl });
    } catch (err) {
      console.error('Error opening file: ', err);
    }
  }


  async statusCall(item: any) {
    try {
      // 1. Check internet connectivity
      const status = await Network.getStatus();
      if (!status.connected) {
        this.common.presentAlert(
          "No internet connection. Please check your network and try again."
        );
        return false;
      }

      // 2. Show loader
      this.loaderService.showLoader();

      // 3. Prepare API request

      const options = {
        url: this.common.commonservice1 + "uploadOrViewCustomerData/updateAttachmentViewStatus.spring",
        headers: { "Content-Type": "application/json" },
        data: {
          file_Id: item.file_Id,
          fileViewedBy: item.fileViewedBy
        }
      };


      console.log("API Request:", options);

      // 4. API call
      const { data } = await CapacitorHttp.post(options);
      console.log("API Response:", data);

      if (data.responseCode === 200) {
        this.Documents();
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
