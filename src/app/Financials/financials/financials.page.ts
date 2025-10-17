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
    { label: 'Demand', icon: 'stats-chart-outline', type: 'demand' },
    { label: 'Receipt', icon: 'receipt-outline', type: 'receipt' },
    { label: 'Invoices', icon: 'document-outline', type: 'invoice' },
    { label: 'Interest', icon: 'layers', type: 'interest' },
  ];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private cmn: CommonService,
    private router: Router
  ) {}

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

  redirectTOPaymentDetails() {
    // if (paymentStatusId === '6' && percentage === '0') return;
    // this.router.navigate(['/paymentreceipts'], {
    //   queryParams: { paymentScheduleId, paymentStatusId, mileStoneName, redirect_map_id }
    // });
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
      sessionKey: localStorage.getItem("sessionkey"),
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
      sessionKey: localStorage.getItem("sessionkey"),
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
    this.router.navigate(['/receipt'], { queryParams: { type } });
  }
  else if (type === 'invoice') {
    this.router.navigate(['/invoices'], { queryParams: { type } });
  }
}

}