import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { GenerateModelPage } from '../features/kyc-auth/generate-model/generate-model.page';
import { Network } from '@capacitor/network';
import { LoaderService } from '../LoaderService';
import { CapacitorHttp } from '@capacitor/core';
import swiper from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  categories: Array<any> = [];
  @ViewChild('swiper') swiper: SwiperComponent;
  chunkedCategories: any[][] = [];

  iconMap: any = {
    "Financials": {
      icon: "assets/imgs/dashboard_new/Group.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFE4D5 40%)",
      textColor: "#1A1A1A"
    },
    "Tickets": {
      icon: "assets/imgs/dashboard_new/Tickets_1.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #E4FFC2 40%)",
      textColor: "#1A1A1A"
    },
    "Company Updates": {
      icon: "assets/imgs/dashboard_new/update.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #E5F3FB 40%)",
      textColor: "#1A1A1A"
    },
    "Inbox": {
      icon: "assets/imgs/dashboard_new/inbox.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFE598 40%)",
      textColor: "#1A1A1A"
    },
    "MPR": {
      icon: "assets/imgs/dashboard_new/elements.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #EEF0FF 40%)",
      textColor: "#1A1A1A"
    },
    "Project Updates": {
      icon: "assets/imgs/dashboard_new/mpr.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #E7E7FF 40%)",
      textColor: "#1A1A1A"
    },
    "Upload Images": {
      icon: "assets/imgs/dashboard_new/upload.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #E5F3FB 40%)",
      textColor: "#1A1A1A"
    },
    "Complaints": {
      icon: "assets/imgs/dashboard_new/complaints.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFD0D0 40%)",
      textColor: "#1A1A1A"
    },
    "Book Your Appointment": {
      icon: "assets/imgs/dashboard_new/bookapoint.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #EBDBFF 40%)",
      textColor: "#1A1A1A"
    },
    "Apply Loan": {
      icon: "assets/imgs/dashboard_new/applyloan.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FDD5B9 40%)",
      textColor: "#1A1A1A"
    },
    "References": {
      icon: "assets/imgs/dashboard_new/refrence.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFE2FF 40%)",
      textColor: "#1A1A1A"
    },
    "Selections": {
      icon: "assets/imgs/dashboard_new/selection.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #E0FFE4 40%)",
      textColor: "#1A1A1A"
    },
    "Unit Details": {
      icon: "assets/imgs/dashboard_new/unitdetails.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFE9BD 40%)",
      textColor: "#1A1A1A"
    },
    "Insight": {
      icon: "assets/imgs/dashboard_new/insights.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFF3C5 40%)",
      textColor: "#1A1A1A"
    },
    "Change MPIN": {
      icon: "assets/imgs/dashboard_new/changempin.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFF1D9 40%)",
      textColor: "#1A1A1A"
    },
    "FAQ": {
      icon: "assets/imgs/dashboard_new/faq.png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFB8C9 40%)",
      textColor: "#1A1A1A"
    },

    "Profile": {
      icon: "assets/imgs/dashboard_new/Vector (14).png",
      color: "linear-gradient(135deg, #FFFFFF -30%, #FFB8C9 40%)",
      textColor: "#1A1A1A"
    }
  };






  // my_id = localStorage.getItem('Myflat_id');
  myflatids: any[] = [];
  my_id: string | null = null;
  username: string | null;
  statid: string | null;
  allowedTabs: string[];
  footerTabs: any[];
  footerIconMap: any;
  flatNumber: string = ''; // This is your property name

  chunkArray(arr: any[], size: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  // get flatNumber(): string {
  //   return localStorage.getItem('Myflat_Num') || '';
  // }

  constructor(private router: Router, private modalCtrl: ModalController, private loadingCtrl: LoaderService,
    private cmn: CommonService, private alertController: AlertController,    private cdr: ChangeDetectorRef  // Add this
) {
    this.username = localStorage.getItem("username");
    this.statid = localStorage.getItem("projectName");

    this.dynamicdashboardgrids();

  }

  flatNo: string = '';
chunkCategories() {
  const chunkSize = 3;
  this.chunkedCategories = []; 
  
  for (let i = 0; i < this.categories.length; i += chunkSize) {
    this.chunkedCategories.push(this.categories.slice(i, i + chunkSize));
  }
  
  // Load flats once, not in every loop iteration
  const flatsString = localStorage.getItem('flats') || '[]';
  try {
    const parsedFlats = JSON.parse(flatsString);
    if (Array.isArray(parsedFlats) && parsedFlats.length > 0) {
      this.myflatids = parsedFlats;
    } else {
      console.warn('No flats found in localStorage during chunkCategories');
      this.myflatids = [];
    }
  } catch (e) {
    this.myflatids = [];
    console.error('Error parsing flats JSON in chunkCategories:', e);
  }
  console.log(this.myflatids, 'myflatids loaded in chunkCategories');
}

  ngOnInit() {
    // this.chunkArray(this.myflatids, 3);\
    this.chunkCategories();
    // Read the selected flat number from localStorage key where you stored it
    this.flatNumber = localStorage.getItem('Myflat_Num') || '';
    console.log(this.flatNumber, 'flatNumber in dashboard');

    try {
      const storedFlats = localStorage.getItem('flats');
      const myflatids = storedFlats ? JSON.parse(storedFlats) : [];
      this.flatNo = myflatids?.[0]?.flatNo || ''; // <-- set flat number
    } catch (e) {
      console.error('Invalid JSON in flats:', e);
      //this.flatNo = '';
    }
  }

// ionViewWillEnter() {
//   // Refresh flat number whenever entering dashboard
//   this.flatNumber = localStorage.getItem('Myflat_Num') || '';
//   console.log('Dashboard entered, flat number refreshed:', this.flatNumber);
// }

  navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn('No route provided for navigation');
    }
  }
async openUnitModal() {
    console.log('Icon clicked');

    // Ensure chunkCategories() has run and populated myflatids
    if (!Array.isArray(this.myflatids) || this.myflatids.length === 0) {
      this.cmn.presentAlert('There are no flats assigned. Please log out and log back in.');
      return false;
    }

    console.log(this.myflatids, 'flats being passed to modal');

    localStorage.setItem('cancelshow', 'show');

    const modal = await this.modalCtrl.create({
      component: GenerateModelPage,
      componentProps: { myflatids: this.myflatids },
      backdropDismiss: true,
      cssClass: 'unit-modal',
    });
    await modal.present();

    const { data: selectedFlat } = await modal.onDidDismiss();
    console.log('Modal dismissed with data:', selectedFlat);

    if (selectedFlat && selectedFlat.flatNo) {
      this.flatNumber = selectedFlat.flatNo;
      localStorage.setItem('Myflat_Num', selectedFlat.flatNo);
      localStorage.setItem('Myflat_id', selectedFlat.flatId.toString());
      console.log('Dashboard updated with selected flat:', selectedFlat.flatNo);
      
      // Manually trigger change detection
      this.cdr.detectChanges();
      
    } else {
      // Fallback to stored value
      this.flatNumber = localStorage.getItem('Myflat_Num') || '';
      console.log('No data returned, flatNumber is now:', this.flatNumber);
      
      // Manually trigger change detection
      this.cdr.detectChanges();
    }

    return true;
  }

  // Also add to ionViewWillEnter
  ionViewWillEnter() {
    this.flatNumber = localStorage.getItem('Myflat_Num') || '';
    console.log('Dashboard entered, flat number refreshed:', this.flatNumber);
    this.cdr.detectChanges(); // Add this
  }


  async dynamicdashboardgrids() {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }
    this.loadingCtrl.showLoader();
    const url = this.cmn.commonservice + "login/getAppMenuList.spring";
    const options = {
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceId": this.cmn.deviceToken,
        "sessionKey": "" + localStorage.getItem('sessionkey_afterlogin'),
        "flatId": localStorage.getItem('Myflat_id')
      }
    };

    console.log(options.url);
    console.log(JSON.stringify(options.data));
    try {
      const response = await CapacitorHttp.post(options);
      this.loadingCtrl.hideLoader();
      const data = response.data;
      console.log(data);
      if (data) {
        if (data.responseCode === 200) {
          this.categories = [
            ...response.data.responseObjList.appmenupojo10,
            ...response.data.responseObjList.appmenupojo11,
            ...response.data.responseObjList.appmenupojo12
          ].map(item => {
            const iconData = this.iconMap[item.appMenuName] || {};

            return {
              ...item,
              appmenuimgPath: iconData.icon || item.appmenuimgPath,
              color: iconData.color || item.color || 'linear-gradient(135deg, #FFFFFF -30%, #F0F0F0 40%)', // fallback
              textColor: iconData.textColor || item.textColor || '#1A1A1A'
            };
          }).sort((a, b) => a.priority - b.priority);

          this.chunkedCategories = this.chunkArray(this.categories, 9);

          this.allowedTabs = ["Financials", "Tickets", "Inbox", "Profile"];

          this.footerIconMap = {
            "Financials": "assets/imgs/dashboard_new/loans.png",
            "Tickets": "assets/imgs/dashboard_new/password.png",
            "Inbox": "assets/imgs/dashboard_new/receipt-2-svgrepo-com 1.png",
            "Profile": "assets/imgs/dashboard_new/units.png"
          };

          this.footerTabs = this.categories
            .filter(item => this.allowedTabs.includes(item.appMenuName))
            .map(item => {
              return {
                ...item,
                appmenuimgPath: this.footerIconMap[item.appMenuName] || item.appmenuimgPath
              };
            });

          console.log(this.footerTabs);

        } else if ([600, 700, 800].includes(data.responseCode)) {
          this.cmn.presentAlert(data.status);
        } else {
          this.cmn.presentAlert("Something went wrong. Please try again later.");
        }
      }

    } catch (err) {
      this.loadingCtrl.hideLoader();
      if (err && typeof err === 'object' && 'status' in err && (err as any).status === 0) {
        this.cmn.presentAlert("Unable to connect to server. Please check your internet connection.");
      } else {
        this.cmn.presentAlert("Server error. Please try again later.");
      }
      return false;
    }

  }

  async logoutclicked() {
    const alert = await this.alertController.create({
      header: 'Sumadhura',
      message: 'Are you sure,do you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Yes',
          handler: () => {

            // window.localStorage.clear();
            // this.common.loginDetails.next(null);
            // localStorage.removeItem("mpinhandle");

            localStorage.removeItem("demo");
            localStorage.removeItem("dashboard_new_model");
            localStorage.removeItem("dashboard_model");
            this.router.navigateByUrl("generate-mpin");
            alert.dismiss();
            //  (navigator as any)['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }


  

}

