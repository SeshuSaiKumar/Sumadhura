import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';

import { MenuController } from '@ionic/angular/common';
import { CapacitorHttp } from '@capacitor/core';

import { Network } from '@capacitor/network';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-generate-model',
  templateUrl: './generate-model.page.html',
  styleUrls: ['./generate-model.page.scss'],
})
export class GenerateModelPage implements OnInit {

  @Input() myflatids: any[] = [];

  modalData: any;
  flat_selection: any;
  myFlatid: any[] = [];
  isShow: any;
  disconnectSubscription: any;
  checked: boolean;
  autoManufacturers: number | null = null;
  notificationPopUpMessage: any;
  device: any
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private loadingCtrl: LoaderService,
    private cmn: CommonService,
    // private device: Device,

    private navParams: ActivatedRoute,
    // private menu: MenuController,
  ) {



    localStorage.setItem('flats', JSON.stringify(this.myFlatid));

    sessionStorage.setItem('modalClear', 'true');
  }

 ngOnInit() {
    this.myFlatid = this.myflatids;
    console.log('myflatidsssssss:', this.myFlatid);

    this.autoManufacturers = localStorage.getItem('Myflat_id')
      ? +localStorage.getItem('Myflat_id')!
      : null;
    console.log(this.autoManufacturers, 'autoManufacturers');
  }



  ionViewWillLeave() {
    sessionStorage.setItem('modalClear', '');
  }

  ionViewDidEnter() {
    // this.menu.enable(true, 'menu2');
  }

  ionViewDidLoad() {
    // this.menu.enable(true, 'menu2');
  }

submitFun(item: any) {
  this.autoManufacturers = item.flatId;
  localStorage.setItem('Myflat_Num', item.flatNo); // for display only, do not call API here
  console.log(this.autoManufacturers, 'autoManufacturers in submitFun');
  console.log(item.flatNo, 'item.flatNo in submitFun');


}

async confirmSelection() {
  if (!this.autoManufacturers) {
    this.cmn.presentAlert('Please select a flat');
    return;
  }

  const selectedFlat = this.myFlatid.find(f => f.flatId === this.autoManufacturers);
  if (!selectedFlat) {
    this.cmn.presentAlert('Selected flat not found');
    return;
  }

  // Call backend API to update session etc.
  const success = await this.flatSubmission(selectedFlat.flatId);
  if (success) {
    localStorage.setItem('Myflat_Num', selectedFlat.flatNo);
    console.log(selectedFlat.flatNo, 'selectedFlat.flatNo');
    
    localStorage.setItem('Myflat_id', selectedFlat.flatId.toString());
    
    // Call dynamicMenu to get menu data but don't navigate
    const menuSuccess = await this.dynamicMenu(selectedFlat.flatId, localStorage.getItem('sessionkey_afterlogin') || '');
    
    if (menuSuccess) {
      // Dismiss modal with selected flat data AND navigation flag
      await this.modalCtrl.dismiss({
        selectedFlat: selectedFlat,
        navigateToDashboard: true  // Flag to indicate navigation needed
      });
    }
  } else {
    this.cmn.presentAlert('Failed to submit flat selection. Please try again.');
  }
}

async dynamicMenu(flatId: string, sessionkey: string): Promise<boolean> {
  await this.loadingCtrl.showLoader();

  try {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert('No Internet connection. Please check your network.');
      return false;
    }

    const url = this.cmn.commonservice + 'login/getAppMenuDetails.spring';

    const body = {
      deviceId: localStorage.getItem('deviceTokenId') || '',
      sessionKey: sessionkey,
      flatId: flatId,
    };

    const options = { url, headers: { 'Content-Type': 'application/json' }, data: body };
    const response = await CapacitorHttp.post(options);
    const resp = response.data;

    if (resp.responseCode === 200) {
      sessionStorage.setItem('dashboardTabsStatus', '');
      localStorage.setItem('dynamicCustomermenuItems', JSON.stringify(resp.responseObjList));
      localStorage.setItem('tabsobject', JSON.stringify(resp.objList.appBottomMenuPojoList));

      resp.responseObjList.forEach((item: any) => {
        if (item.appMenuName === 'Tickets') {
          sessionStorage.setItem('dashboardTabsStatus', 'true');
        }
      });

      sessionStorage.setItem('Financialpage', '');
      
      // DON'T navigate here - let the calling page handle navigation
      // await this.navCtrl.navigateRoot('/dashboard');
      
      return true;
    } else {
      this.cmn.presentAlert(resp.status || 'Something went wrong.');
      return false;
    }
  } catch (err: any) {
    console.error('Dynamic Menu Error:', err);
    // ... error handling
    return false;
  } finally {
    this.loadingCtrl.hideLoader();
  }
}


async flatSubmission(flatId: string): Promise<boolean> {
  await this.loadingCtrl.showLoader();

  try {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert('No Internet connection. Please check your network.');
      return false;
    }

    const url = this.cmn.commonservice + 'login/flatSpecificSession.spring';

    const body = {
      deviceId: this.cmn.deviceToken || '',
      username: this.cmn.uuid || '',
      password: localStorage.getItem('loginpinsession') || '',
      uuid: this.cmn.uuid || '',
      serialNo: this.cmn.serialNo || '',
      appRegId: localStorage.getItem('appRegId') || '',
      flatId: flatId,
      custId: localStorage.getItem('mycustId') || '',
    };

    const options = { url, headers: { 'Content-Type': 'application/json' }, data: body };
    const response = await CapacitorHttp.post(options);
    const resp = response.data;

    this.notificationPopUpMessage = resp.notificationPopUpMessage;
    localStorage.setItem('contactmessage', this.notificationPopUpMessage);
    localStorage.setItem('projectName', resp.objList.stateId);
    localStorage.setItem('flat_booking_id', resp.objList.flatBookingId);
    localStorage.setItem('siteId', resp.objList.flat.floor.block.site.id);
    localStorage.setItem('blockId', resp.objList.flat.floor.block.blockId);
    localStorage.setItem('Myflat_id', flatId); // Fixed typo: was 'Myflat_Id'

    if (resp.responseCode == 200) {
      localStorage.setItem('sessionkey_afterlogin', resp.sessionKey);
      
      // REMOVED: Don't navigate here, let dashboard handle modal dismissal
      // this.navCtrl.navigateRoot('/dashboard');
      
      return true;
    } else if (resp.responseCode == 534) {
      this.cmn.presentAlert(resp.status);
      return false;
    } else {
      this.cmn.presentAlert(resp.status || 'Please try again after some time');
      return false;
    }

  } catch (err: any) {
    console.error('Flat submission error:', err);
    if (!navigator.onLine) {
      this.cmn.presentAlert('No Internet connection.');
    } else if (err.status === 0) {
      this.cmn.presentAlert('Unable to connect to server.');
    } else {
      this.cmn.presentAlert('Please try again after some time.');
    }
    return false;
  } finally {
    this.loadingCtrl.hideLoader();
  }
}


async dynamicMenu2(flatId: string, sessionkey: string): Promise<boolean> {
  await this.loadingCtrl.showLoader();

  try {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.cmn.presentAlert('No Internet connection. Please check your network.');
      return false;
    }

    const url = this.cmn.commonservice + 'login/getAppMenuDetails.spring';

    const body = {
      deviceId: localStorage.getItem('deviceTokenId') || '',
      sessionKey: sessionkey,
      flatId: flatId,
    };

    const options = { url, headers: { 'Content-Type': 'application/json' }, data: body };
    const response = await CapacitorHttp.post(options);
    const resp = response.data;

    if (resp.responseCode === 200) {
      sessionStorage.setItem('dashboardTabsStatus', '');
      localStorage.setItem('dynamicCustomermenuItems', JSON.stringify(resp.responseObjList));
      localStorage.setItem('tabsobject', JSON.stringify(resp.objList.appBottomMenuPojoList));

      resp.responseObjList.forEach((item: any) => {
        if (item.appMenuName === 'Tickets') {
          sessionStorage.setItem('dashboardTabsStatus', 'true');
        }
      });

      sessionStorage.setItem('Financialpage', '');
      await this.navCtrl.navigateRoot('/dashboard');  // Navigate here only once
      return true;
    } else {
      this.cmn.presentAlert(resp.status || 'Something went wrong.');
      return false;
    }
  } catch (err: any) {
    console.error('Dynamic Menu Error:', err);
    if (!navigator.onLine) {
      this.cmn.presentAlert('No Internet connection.');
    } else if (err.status === 0) {
      this.cmn.presentAlert('Unable to connect to server.');
    } else {
      this.cmn.presentAlert('Please try again after some time.');
    }
    return false;
  } finally {
    this.loadingCtrl.hideLoader();
  }
}

closeModal() {
  this.modalCtrl.dismiss();
}
}