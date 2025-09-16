import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-financials',
  templateUrl: './financials.page.html',
  styleUrls: ['./financials.page.scss'],
})
export class FinancialsPage implements OnInit {
  selectedTab: string = 'basic';

  totalAmount: any;
  total_paid_amount: any;
  total_due_amount: any;
  interest_amount: any;
  convertedintstamount: any;
  items: any[] = [];
  milstonLength: number = 0;
  milStoneNo: any;
  backbutton_page: any;
  documents = [
    { label: 'Demand', icon: 'assets/imgs/dashboard_new/Demand icon.png', type: 'demand' },
    { label: 'Receipt', icon: 'assets/imgs/dashboard_new/Invoice Icon.png', type: 'receipt' },
    { label: 'Invoices', icon: 'assets/imgs/dashboard_new/Layer 2 (1).png', type: 'invoice' },
    { label: 'Interest', icon: 'assets/imgs/dashboard_new/Group (9).png', type: 'interest' },
  ];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private cmn: CommonService,
    private router: Router
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    // this.menuCtrl.enable(true, 'menu2');
    this.backbutton_page = sessionStorage.getItem('backbuttonpage');
    this.getFinancialData();
    this.paymentReminder();
  }

  interestDetails() {
    this.router.navigate(['/interest-details']);
  }

  paymentReceipts() {
    this.router.navigate(['/paymentreceipts']);
  }

  demandNote() {
    this.router.navigate(['/demandnote']);
  }

  legal_modification_invoice() {
    this.router.navigate(['/legal-modification-invoices']);
  }

  interestLetter() {
    this.router.navigate(['/interest-letter']);
  }

  redirectTOPaymentDetails(items: any) {
    console.log(items);

    if (items.paymentStatusId === '6' || items.paymentStatusId === '0') {
      return; // Do nothing if status is 6 or 0
    }

    this.router.navigate(['/receipt'], {
      queryParams: { items: JSON.stringify(items) }
    });
  }



  async getFinancialData() {
    const url = `${this.cmn.commonservice}financial/financialDtls.spring`;

    const options = {
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        deviceId: localStorage.getItem("deviceTokenId") || "null",
        sessionKey: localStorage.getItem("sessionkey_afterlogin"),
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      const resp = response.data;

      if (resp.responseCode === 200) {
        this.totalAmount = resp.totoalAmount;
        this.total_paid_amount = resp.totalMilestonePaidAmount;
        this.total_due_amount = resp.totalMilestoneDueAmount;
        this.interest_amount = resp.sumOfTotalPendingPenaltyAmount;
        this.convertedintstamount = resp.showInterestDetailsButton;
        this.items = resp.mileStones || [];
        this.milstonLength = this.items.length;
        this.milStoneNo = this.items?.[this.items.length - 1]?.milStoneNo;
      } else {
        this.cmn.presentAlert(resp.status);
        if (resp.responseCode === 700) {
          this.router.navigate(['/dashboard-grids']);
        }
      }

    } catch (err) {
      if (localStorage.getItem("oflineonline") === "offline") {
        this.cmn.presentAlert("Network unavailable. Please check and try again!");
      } else {
        this.cmn.presentAlert("Please try after some time!");
      }
    }
  }

  async paymentReminder() {
    const url = `${this.cmn.commonservice}financial/savePaymentReminderViewStatus.spring`;

    const options = {
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        deviceId: localStorage.getItem("deviceTokenId") || "null",
        sessionKey: localStorage.getItem("sessionkey_afterlogin"),
        viewedFrom: "Financial Tab",
      }
    };

    try {
      const response = await CapacitorHttp.post(options);
      const resp = response.data;
      // You can handle response here if needed
    } catch (err) {
      // this.cmn("Unable to send payment reminder.");
    }
  }
  viewDetails() {
    alert('Showing interest details...');
  }

  openDoc(type: string) {
    if (type === 'interest') {
      this.router.navigate(['/intrest']);
    } else if (type === 'demand') {
      // For all other document types, navigate to demandnote with query params
      this.router.navigate(['/demand'], { queryParams: { type } });
    }
    else if (type === 'receipt') {
      this.router.navigate(['/receipt'], {
        queryParams: { items: JSON.stringify("Receipt") }
      });

      // this.router.navigate(['/receipt'], { queryParams: { type } });
    }
    else if (type === 'invoice') {
      this.router.navigate(['/invoices'], { queryParams: { type } });
    }
  }

  //  tab_redirect_fun(data: any) { }

}