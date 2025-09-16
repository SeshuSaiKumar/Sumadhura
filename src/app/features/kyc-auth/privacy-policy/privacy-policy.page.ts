import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, IonRouterOutlet, LoadingController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { CapacitorHttp, Plugins } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  policiesData: any;

  constructor(
    public route: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {
    this.get_privacy_policy_fun();
  }

  ngOnInit() {
  }

  async get_privacy_policy_fun() {
    const status = await Network.getStatus();
    if (!status.connected) {
      await this.common.NetworkpresentAlert(true);
      return false;
    }

    this.loaderService.showLoader();
    const options = {
      url: this.common.commonservice + "registration/getPancardSecurityPolicies.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      this.loaderService.hideLoader();
      const resp = response.data;
      if (resp?.responseCode === 200) {
        this.policiesData = resp.pancardSecurityPolices;
        return true;
      } else {
        this.common.presentAlert("Please try again after some time");
        return false;
      }

    } catch (err) {
      this.loaderService.hideLoader();
      const status = await Network.getStatus();
      if (!status.connected) {
        await this.common.NetworkpresentAlert(true);
      } else {
        this.common.presentAlert("Something went wrong. Please try again later.");
      }
      return false;
    }
  }


}
