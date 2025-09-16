import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, Platform, IonRouterOutlet, AlertController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-mpin-policies',
  templateUrl: './mpin-policies.page.html',
  styleUrls: ['./mpin-policies.page.scss'],
})
export class MpinPoliciesPage implements OnInit {

  constructor(public route: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private alertController: AlertController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
  }

}
