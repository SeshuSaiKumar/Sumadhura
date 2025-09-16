import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { EventService } from 'src/app/event.service';

@Component({
  selector: 'app-pan-number-double-flat-model',
  templateUrl: './pan-number-double-flat-model.page.html',
  styleUrls: ['./pan-number-double-flat-model.page.scss'],
})
export class PanNumberDoubleFlatModelPage implements OnInit {
  @Input() model_data: string[] = [];
  @Input() model_emailIDS: string[] = [];
  mobile: any = '';
  email: any = '';

  constructor(
    public modalCtrl: ModalController,
    public common: CommonService,
    public loader: LoaderService,
    private eventService: EventService,
    private navCtrl: NavController,
    private router: Router,
  ) { }

  ngOnInit(): void {

  }
  emailSelection(model_emailIDS: any) {
    this.email = [model_emailIDS];
  }
  async submitFun() {
    // 🛑 Validate mobile selection
    if (this.model_data?.length > 1 && (!this.mobile || this.mobile.trim() === '')) {
      this.common.presentAlert("Please select a mobile number");
      return;
    }

    // 🛑 Validate email selection
    if (this.model_emailIDS?.length > 1 && (!this.email || this.email.trim() === '')) {
      this.common.presentAlert("Please select an email ID");
      return;
    }

    // Auto-select if only one available
    if (this.model_data?.length === 1) {
      this.mobile = this.model_data[0];
    }
    if (this.model_emailIDS?.length === 1) {
      this.email = this.model_emailIDS[0];
    }

    // ✅ Check network before calling API
    if (!navigator.onLine) {
      this.common.NetworkpresentAlert(true); // 🔴 show "No Internet" popup
      return;
    }

    this.loader.showLoader();
    const url = this.common.commonservice + "registration/sendOTP.spring";
    const options = {
      url,
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "mobileNo": this.mobile,
        "emails": [this.email]
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      this.loader.hideLoader();

      const resp = response.data;
      console.log("OTP Response:", resp);

      if (resp.responseCode === 534) {
        // ✅ OTP sent successfully
        this.common.presentAlert(resp.status);

        localStorage.setItem('mobilenum_session', resp.mobileNo);
        localStorage.setItem('emails_session', this.email);
        localStorage.setItem('session_key', resp.sessionKey);

        const tempmob = "*".repeat(resp.mobileNo.length - 3) + resp.mobileNo.slice(-3);
        const emailidss = resp.emails;

        sessionStorage.setItem('tempmob_session', tempmob);
        sessionStorage.setItem('emailidss_session', emailidss);

        this.modalCtrl.dismiss();
        this.eventService.emitEvent({ page: 'RegistrationPage' });
        this.navCtrl.navigateForward(['/otp-verify'], { state: { tempmob, emailidss } });

      } else if ([539, 540, 600, 700].includes(resp.responseCode)) {
        this.common.presentAlert(resp.status);
      } else {
        this.common.presentAlert("Unexpected error. Please try again later.");
      }

    } catch (error) {
      this.loader.hideLoader();
      console.error("Error during OTP submission:", error);

      if (!navigator.onLine) {
        this.common.NetworkpresentAlert(true); // 🔴 show "No Internet"
      } else {
        this.common.presentAlert("Unable to send OTP. Please try again later.");
      }
    }
  }


}



