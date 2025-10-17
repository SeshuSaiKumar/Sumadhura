import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from 'src/app/common.service';
import { ZoomImgComponent } from 'src/app/components/zoom-img/zoom-img.component';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.page.html',
  styleUrls: ['./project-view.page.scss'],
})
export class ProjectViewPage implements OnInit {
projectUpdate: any = {}; // or use a proper interface instead of any
siteImagesMap: { [key: string]: string } = {
  'Folium by Sumadhura Phase 2': '/assets/imgs/Notifications_Default_Images/146_Project.jpg',
  'Sarang by Sumadhura Phase 1': '/assets/imgs/Notifications_Default_Images/134_Project.png',
  'Aspire Amber': '/assets/imgs/Notifications_Default_Images/139_Project.jpg',
  'The Olympus': '/assets/imgs/Notifications_Default_Images/134_Project.png',
  'Sumadhura Gardens by the Brook': '/assets/imgs/Notifications_Default_Images/134_Project.png',
  'Aspire Aurum': '/assets/imgs/Notifications_Default_Images/131_Project.jpg',
  'Sumadhura Sushantham Phase 2': '/assets/imgs/Notifications_Default_Images/130_Project.jpg',
  'Folium by Sumadhura Phase 1': '/assets/imgs/Notifications_Default_Images/126_Project.jpg',
  'Sumadhura Sushantham Phase 1': '/assets/imgs/Notifications_Default_Images/124_Project.jpg',
  'Sumadhura Horizon': '/assets/imgs/Notifications_Default_Images/114_Project.jpg',
  'Sumadhura Nandanam': '/assets/imgs/Notifications_Default_Images/111_Project.jpg',
  'Sumadhura Eden Garden': '/assets/imgs/Notifications_Default_Images/111_Project.jpg',
  'Sumadhura Gardens by the Brook Phase 2': '/assets/imgs/Notifications_Default_Images/134_Project.png',
  'Folium by Sumadhura Phase 3': '/assets/imgs/Notifications_Default_Images/134_Project.png',
  'Sumadhura Acropolis': '/assets/imgs/Notifications_Default_Images/102_Project.jpg'
};
 dataArray: any;
  mesg: any;
  descrip: any;
  receivedDat: any;
  notification_id: any;
  Images: any;
  commnurl_notification: string;
  fileLink: any;
  disconnectSubscription: any;
  read_status: any;
  siteName: any;
  @ViewChild(ZoomImgComponent, { static: false }) zoomImgComp!: ZoomImgComponent;
   selectedImage: string | null = null;

constructor(private route: ActivatedRoute,private cmn: CommonService,private loaderService: LoaderService) 
{ 

    this.route.queryParams.subscribe(params => {
    if (params['ticket']) {
      this.projectUpdate = JSON.parse(params['ticket']);
      console.log('Received update:', this.projectUpdate);
      this.goToViewPage_unread(this.projectUpdate.id);
      console.log(this.projectUpdate,'goToViewPage_unread');
    }
  });
   
   
   
   
}

  ngOnInit() {
  //     this.route.queryParams.subscribe(params => {
  //   if (params['ticket']) {
  //     this.projectUpdate = JSON.parse(params['ticket']);
  //     console.log('Received update:', this.projectUpdate);
  //   }
  // });
  }
//   hasValidImage(update: any): boolean {
//   return update.image && update.image !== 'NA' && update.image.trim() !== '';
// }
  getDefaultSiteImage(siteName: string): string {
    return this.siteImagesMap[siteName] || 'assets/imgs/Notifications_Default_Images/default.jpg';
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/imgs/Notifications_Default_Images/default.jpg';
  }

  onImageClick(url: string) {
    this.selectedImage = url;
    if (this.zoomImgComp) {
      this.zoomImgComp.openModal();
    }
  }
// async notificationListView() {
// await this.loaderService.showLoader();

//   const url = this.cmn.commonservice + this.commnurl_notification + "/notificationView.spring";

//   const body = {
//     id: this.notification_id
//   };

//   const options = {
//     url,
//     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//     data: body
//   };

//   try {
//     const resp = await CapacitorHttp.post(options);
//     const data = resp.data;
//     console.log("Notification list Data:", JSON.stringify(data));
//     await this.loaderService.hideLoader();

//     if (data.responseCode === 0) {
//       this.dataArray = data;
//       this.mesg = data.message;
//       this.descrip = data.description;
//       this.Images = data.imageList;
//     } else {
//       this.cmn.presentAlert("something went wrong! Please try again");
//     }
//   } catch (err: any) {
//     await this.loaderService.hideLoader();
//     if (err?.status === 0) {
//       this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
//       return false;
//     } else {
//       this.cmn.presentAlert("Error in retrieving the data");
//       return false;
//     }
//   }
// }



async goToViewPage_unread(id: any[]) {
  console.log("UnRead :" + id);

  const url = this.cmn.commonservice + "notification/saveNotifyViewStatus.spring";

  const body = {
    id: id,
    customerId: localStorage.getItem('mycustId'),
    sessionKey: localStorage.getItem('sessionkey'),
    deviceId: localStorage.getItem("deviceTokenId"),
  };

  console.log("URL: " + url);
  console.log("Body: " + JSON.stringify(body));

  const options = {
    url,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    data: body
  };

  try {
    const resp = await CapacitorHttp.post(options);
    const data = resp.data;

    console.log("Notification status Data: " + JSON.stringify(data));

    if (data.responseCode == "200") {
      console.log("success");
    } else if (data.responseCode == 440) {
      this.cmn.presentAlert(data.status);
      return false;
    } else {
      this.cmn.presentAlert("something went wrong! Please try again");
    }
  } catch (err: any) {
    this.cmn.presentAlert("Network error: Please try again");
    console.error(err);
  }

  // Navigate to notification view page if needed
  // this.navCtrl.push(NotificationviewPage, {id});
}

}
