import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { LoaderService } from '../LoaderService';
import { CapacitorHttp } from '@capacitor/core';
import { ProductService } from './project-view/product.service';
import { Device } from '@ionic-native/device/ngx';
'./project.page.html'

// Add this interface above your component decorator
interface ProjectUpdate {
  id: any;
  message: string;
  descriptionWithOutTags: string;
  createdDate: string;
  devices: any[]; // Now included
  image: string; // Add this line
  siteName: string; // Add this line
}

// Then, in your component class, type dataArray as follows:
// dataArray: ProjectUpdate[] = [];
@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  searchText = '';
  selectedId = 4; // example: last card selected/active

    public count: number = 0;
  dataArray: ProjectUpdate[] = [];
  commnurl_notification: string;
  isNotificationResponsesAvailable: boolean;
  isNotificationAvailable: any;
  disconnectSubscription: any;
  appRegId: any;
  backbutton_page: any;
  controller: Array<any> = [];
  filter_Keys = ['message', 'descriptionWithOutTags', 'createdDate'];

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


  // updates = [
  //   {
  //     id: 1,
  //     title: "BIGSAVINGS ARE JUST A ...",
  //     description: "BigSavings Are Just a Tap Away – Don’t miss this limited-time deal.",
  //     date: "Monday, July 28, 2025",
  //     logo: "assets/imgs/Notifications_Default_Images/126_Project.jpg"
  //   },
  //   {
  //     id: 2,
  //     title: "BIGSAVINGS ARE JUST A ...",
  //     description: "BigSavings Are Just a Tap Away – Don’t miss this limited-time deal.",
  //     date: "Monday, July 28, 2025",
  //     logo: "assets/imgs/Notifications_Default_Images/124_Project.jpg"
  //   },
  //   {
  //     id: 3,
  //     title: "MAIL OPTION CHECKING",
  //     description: "For a better view of Tables, use the mail option.",
  //     date: "Monday, July 28, 2025",
  //     logo: "assets/imgs/Notifications_Default_Images/126_Project.jpg"
  //   },
  //   {
  //     id: 4,
  //     title: "MAIL OPTION CHECKING",
  //     description: "For a better view of Tables, use the mail option.",
  //     date: "Monday, July 28, 2025",
  //     logo: "assets/imgs/Notifications_Default_Images/111_Project.jpg"
  //   },
  //   {
  //     id: 5,
  //     title: "TERMINOLOGY",
  //     description: "In common usage, 'en...'.",
  //     date: "Monday, July 28, 2025",
  //     logo: "assets/imgs/Notifications_Default_Images/126_Project.jpg"
  //   }
  // ];

  constructor(private router: Router,private cmn: CommonService,private loaderService: LoaderService
    ,public service: ProductService
  ) {
    this.appRegId = localStorage.getItem('appRegId')
    console.log(this.appRegId,'appRegId');
    
    this.backbutton_page = sessionStorage.getItem("backbuttonpage")

    // alert(this.appRegId)
    this.commnurl_notification = "notification"
    this.notificationList();
  }
   ngOnInit() {
     this.notificationList();
   }
   ionViewWillEnter() {
    this.notificationList();
  }
  ionViewDidEnter() {
    this.notificationList();
  }
  openDetail(update: any) {
    this.router.navigate(['/NotificationsPage/project-view', update.id]);
  }

  // get filteredUpdates() {
  //   if (!this.searchText) return this.updates;
  //   const txt = this.searchText.toLowerCase();
  //   return this.updates.filter(u =>
  //     u.title.toLowerCase().includes(txt) ||
  //     u.description.toLowerCase().includes(txt) ||
  //     u.date.toLowerCase().includes(txt)
  //   );
  // }


  async notificationList() {
  await this.loaderService.showLoader();

  const url = this.cmn.commonservice + "notification/sitesNotifys.spring";

  const body = {
    deviceId: localStorage.getItem("deviceTokenId") || "",
    customerId: localStorage.getItem("mycustId") || "",
    flatId: localStorage.getItem("Myflat_id") || "",
    sessionKey: localStorage.getItem("sessionkey") || ""
  };

  try {
    const response = await CapacitorHttp.post({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    });

    await this.loaderService.hideLoader();

    const resp = response.data; // CapacitorHttp returns JSON automatically if server sends JSON
    console.log("API Response => ", resp);

    if (resp.responseCode == "200") {
      this.dataArray = resp.notificationResponses;
      this.isNotificationAvailable = resp.isNotificationResponsesAvailable;

      this.controller = [];
console.log(this.dataArray);

      for (let i = 0; i < resp.notificationResponses.length; i++) {
        for (let j = 0; j < resp.notificationResponses[i].devices.length; j++) {
          const device = resp.notificationResponses[i].devices[j];
          if (device.appRegId == this.appRegId) {
            if (device.viewStatus === false) {
              this.controller.push(device.viewStatus);
              this.service.sendNumber(this.increament());
            }
          }
        }
      }

      if (this.controller.length === 0) {
        this.service.sendNumber(this.increament());
      }

    } else if (resp.responseCode == 440) {
      this.cmn.presentAlert(resp.status);
    } else {
      this.cmn.presentAlert("Something went wrong! Please try again");
    }

  } catch (err: any) {
    await this.loaderService.hideLoader();

    if (err.status == 0) {
      this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
    } else {
      this.cmn.presentAlert("Please try again after some time");
    }
  }
}
  increament() {
    if(this.controller.length == 0){
      
      return 0;
    } else {
      this.count = this.controller.length;
      return this.count;
    }
    
  }
goToViewPage(update: any) {
 this.router.navigate(['/NotificationsPage/project-view'], {
    queryParams: { ticket: JSON.stringify(update) }
  });
}

getDeviceStatusClass(devices: any[], appRegId: number): string {
  // Find device for current user
  const device = devices.find(d => d.appRegId == appRegId);
  if (!device) return 'bg-1'; // fallback
  return device.viewStatus === false ? 'bg-1' : 'bg-2';
}

}