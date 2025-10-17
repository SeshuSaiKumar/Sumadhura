import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { AlertController, IonContent, LoadingController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.page.html',
  styleUrls: ['./ratings.page.scss'],
})
export class RatingsPage implements OnInit {
 rating = 1; // default selected (Love emoji)
  review = '';
  emojis = [
    '&#128545;', // Angry
    '&#128528;', // Unhappy/Neutral
    '&#128533;', // Sad/Low
    '&#128522;', // Happy
    '&#128525;', // Love/Excellent
  ];

complaint_Status: string;
  ticketId:any;
  feedbackDesc:any;
  ticketType: any;
  NonFeedBackData: any;
  show: string;
  exitVal: any;
  tabBarElement: any;
  assignedEmp: any;
  ticketRate: number = this.rating + 1; // Convert 0-based index to 1-based rating
  five_ten_star_status: number;
  totalratingPoints: number;
num: any = 0;
  @ViewChild('chatContent', { static: false }) content: IonContent;


  constructor(private route: ActivatedRoute, private router: Router, private alertCtrl: AlertController,
    private loadingCtrl: LoaderService,
    private platform: Platform,
    private cmn: CommonService,) { 
this.route.queryParams.subscribe(params => {
  console.log("Query Params: ", params);
    this.ticketId = params['ticketId'];
    this.ticketType = params['ticketType'];
    this.complaint_Status = params['complaint_Status'];
    this.assignedEmp = params['assignedEmp'];
  console.log('Ticket ID:', this.ticketId);
    console.log('Ticket Type:', this.ticketType);
    console.log('Complaint Status:', this.complaint_Status);
    console.log('Assigned Employee:', this.assignedEmp);
  });

      const statusStr = localStorage.getItem("complaint_Status");
      this.five_ten_star_status = statusStr !== null ? Number(statusStr) : 0;
    console.log("five_ten_star_status :"+this.five_ten_star_status)
    this.NonFeedBackData=localStorage.getItem("data");
    console.log("NonFeedBackData: "+JSON.stringify(this.NonFeedBackData));
    this.exitVal=localStorage.getItem("exitval");
    if(this.NonFeedBackData){
      this.ticketId=this.NonFeedBackData[0].ticketId;
      this.ticketType=this.NonFeedBackData[0].ticketType;
      
      let templogoutstatus = sessionStorage.getItem('formenulogout')
      console.log("templogoutstatus :"+templogoutstatus)
if(templogoutstatus == 'true'){
  if(this.NonFeedBackData[0].complaintOrTicket == 'complaint'){
    this.five_ten_star_status = 85
  }else{
    this.five_ten_star_status = 86
  }
  
 // this.five_ten_star_status=this.NonFeedBackData[0].complaintsStatus;
}
//http://localhost:8888/SumadhuraGateway/customerservice/feedback/saveTktFeedback.spring
    //  this.five_ten_star_status = 85;
   //  this.five_ten_star_status=this.NonFeedBackData[0].complaintStatus;
     console.log(this.five_ten_star_status)
      this.show="true";
    }
    console.log("NonFeedBackData: "+this.NonFeedBackData);
  }

  ionViewDidLoad() {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    console.log('ionViewDidLoad FeedbackRatingPage');
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    sessionStorage.setItem("complaintfeedbackstatus","")
    this.tabBarElement.style.display = 'flex';
  }

    onPaste(event: ClipboardEvent): void {
    const maxLength = 150;

    // Get pasted content
    const pastedText = event.clipboardData?.getData('text') || '';
    const currentText = this.feedbackDesc;

    // Check if the total length after pasting exceeds the limit
    if (currentText.length + pastedText.length > maxLength) {
      event.preventDefault(); // Prevent the default paste action
      // Append only the allowed number of characters
      const allowedText = pastedText.substring(0, maxLength - currentText.length);
      this.feedbackDesc += allowedText;
    }
  }
onInputChange(event: any) {

    const value = event.target.value;
    if (value && value.length > 0) {
      // Capitalize the first letter and keep the rest of the value as is
      this.feedbackDesc = value.charAt(0).toUpperCase() + value.slice(1);
    }


    const maxLength = 2000;
    const input = event.target as HTMLTextAreaElement;

    // If the input value exceeds the max length, truncate it
    if (input.value.length > maxLength) {
      this.feedbackDesc = input.value.substring(0, maxLength);
      input.value = this.feedbackDesc; // Update the textarea value
    }

    
  }
 ngOnInit() {
   this.route.queryParams.subscribe(params => {
    this.ticketId = params['ticketId'];
    this.ticketType = params['ticketType'];
    this.complaint_Status = params['complaint_Status'];
  });
    // Now you can use these variables as needed
    console.log('Ticket ID:', this.ticketId);
    console.log('Ticket Type:', this.ticketType);
    console.log('Complaint Status:', this.complaint_Status);

    // Call your function to load ratings based on these params if needed
}


 selectRating(i: number) {
  this.rating = i;
  this.ticketRate = i + 1; // update ticketRate to 1 to 5 scale
}

  submitFeedback() {
    // Dummy handler, replace with API logic
    console.log('Rating:', this.rating);
    console.log('Review:', this.review);
    alert('Feedback submitted! Thank you.');
    // Reset fields
    this.rating = 4;
    this.review = '';
  }


   async submitRating() {
    // 1. Validate ticketRate selected
    if (this.ticketRate === undefined) {
      const alert = await this.alertCtrl.create({
        header: 'Sumadhura',
        message: "Please rate us",
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    // 2. Validate feedbackDesc length if provided
    if (this.feedbackDesc && this.feedbackDesc.length > 4000) {
      this.cmn.presentAlert("Your comments should be less than 4000 characters");
      return;
    }

    // 3. Loading indicator
   await this.loadingCtrl.showLoader();
    

    // 4. Determine total rating points based on star status
    this.totalratingPoints = (this.five_ten_star_status === 85) ? 10 : 5;

    // 5. Determine URL
    let url = sessionStorage.getItem("complaintfeedbackstatus") === "true" ?
    
      this.cmn.commonservice + "feedback/saveComplaintFeedback.spring" :
      this.cmn.commonservice + "feedback/saveTktFeedback.spring";
    console.log("complaintfeedbackstatus :"+sessionStorage.getItem("complaintfeedbackstatus"));

    // 6. Construct request body
    let body: any;

    if (this.NonFeedBackData && this.NonFeedBackData.length > 0 && this.NonFeedBackData[this.num]) {
      const data = this.NonFeedBackData[this.num];
      body = {
        rating: this.ticketRate,
        feedbackDesc: this.feedbackDesc || "",
        ticketType: data.ticketType,
        ticketId: data.ticketId,
        deviceId: localStorage.getItem("deviceTokenId") || "",
        sessionKey: localStorage.getItem('sessionkey') || "",
        complaintStatus: this.five_ten_star_status,
        complaintOrTicket: data.complaintOrTicket,
        totalRatingPoints: this.totalratingPoints,
        feedbackPageSource: (this.totalratingPoints === 10) ? "Complaint Logout" : "Ticketing Logout"
      };
    } else {
      if (sessionStorage.getItem("complaintfeedbackstatus") === "true") {
        body = {
          rating: this.ticketRate,
          feedbackDesc: this.feedbackDesc || "",
          complaintType: this.ticketType,
          complaintId: this.ticketId,
          deviceId: localStorage.getItem("deviceTokenId") || "",
          sessionKey: localStorage.getItem('sessionkey') || "",
          totalRatingPoints: this.totalratingPoints,
          feedbackPageSource: "Close Complaint"
        };
      } else {
        body = {
          rating: this.ticketRate,
          feedbackDesc: this.feedbackDesc || "",
          ticketType: this.ticketType,
          ticketId: this.ticketId,
          deviceId: localStorage.getItem("deviceTokenId") || "",
          sessionKey: localStorage.getItem('sessionkey') || "",
          complaintStatus: this.five_ten_star_status,
          totalRatingPoints: this.totalratingPoints,
          feedbackPageSource: "Close Ticketing"
        };
      }
    }

    console.log("Request Body:", JSON.stringify(body));

    // 7. Call API via CapacitorHttp
    try {
      const response = await CapacitorHttp.post({
        url,
        headers: { 'Content-Type': 'application/json' },
        data: body
      });

      await this.loadingCtrl.hideLoader();

      const resp = response.data as any; // Cast to expected response type

      console.log("API Response:", resp);

      // 8. Handle API response codes
      if (resp.responseCode === 200) {
        this.num++;

        // Reset rating UI depending on rating scale
        this.resetRatingsUI();

        // Clear feedback for next ticket
        this.feedbackDesc = "";
        if( sessionStorage.getItem("complaintfeedbackstatus") == "true"){
            this.router.navigate(['/ComplaintsPage']);
          }else{
            this.router.navigate(['/CustomerCarePage']);
          }
        // Update ticket info for next feedback if any
        if (this.exitVal === "true" && this.num < this.NonFeedBackData.length) {
          const nextData = this.NonFeedBackData[this.num];
          this.ticketId = nextData.ticketId;
          this.ticketType = nextData.ticketType;
          this.five_ten_star_status = nextData.complaintOrTicket === 'complaint' ? 85 : 86;

          // Scroll to top for new feedback input
          this.content.scrollToTop(400);
        } else {
          // No more feedback, exit or navigate accordingly
          window.sessionStorage.clear();
          // this.platform.exitApp();
        }

      } else if (resp.responseCode === 440 || resp.responseCode === 600) {
        this.cmn.presentAlert(resp.status);
      } else {
        this.cmn.presentAlert(resp.status);
      }

    } catch (error) {
      await this.loadingCtrl.hideLoader();
      console.error("Error submitRating:", error);
      this.cmn.presentAlert("Something went wrong! Please try again.");
    }
  }

  // Reset rating UI stars based on rating system (5 or 10 stars)
  private resetRatingsUI() {
    if (this.five_ten_star_status === 85) {
      for (let i = 0; i < 11; i++) {
        const rateEl = document.getElementById("rate" + (i + 1));
        if (rateEl) {
          rateEl.classList.remove("red", "yellow", "orangered", "blue");
          rateEl.style.borderColor = "gray";
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const rateEl = document.getElementById("rate_5" + (i + 1));
        if (rateEl) {
          rateEl.classList.remove("red");
        }
      }
    }
  }

  // Method for "Remind Later" confirmation and exit flow
  async remindLater() {
    if (this.exitVal === "true") {
      const alert = await this.alertCtrl.create({
        header: 'SUMADHURA',
        message: 'Do you want to Exit?',
        buttons: [
          {
            text: "Exit",
            handler: () => {
              window.sessionStorage.clear();
              // this.platform.exitApp();
            }
          },
          {
            text: "Cancel",
            role: 'cancel',
            handler: () => {
              // Assuming PropertyPage is your home or dashboard page
              this.router.navigate(['/property']);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.router.navigate(['/CustomerCarePage']);
    }
  }

  // Rating selection method for 10 star rating system
  rateMethod(id: number) {
    this.ticketRate = id - 1;
    for (let i = 0; i < 11; i++) {
      const el = document.getElementById("rate" + (i + 1));
      if (el) {
        el.classList.remove("red", "yellow", "orangered", "blue");
        el.style.borderColor = "gray";
      }
    }
    for (let i = 0; i < id; i++) {
      const el = document.getElementById("rate" + (i + 1));
      if (el) {
        if (i === 7 || i === 8) {
          el.classList.add("yellow");
          el.style.borderColor = "#ffe066";
        } else if (i === 9) {
          el.classList.add("orangered");
          el.style.borderColor = "#00e600";
        } else if (i === 10) {
          el.classList.add("blue");
          el.style.borderColor = "#009900";
        } else {
          el.classList.add("red");
          el.style.borderColor = "#ff8080";
        }
      }
    }
  }

  // Rating method for 5 star rating system
  rateMethod_five(id: number) {
    this.ticketRate = id;
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById("rate_5" + (i + 1));
      if (el) { el.classList.remove("red"); }
    }
    for (let i = 0; i < id; i++) {
      const el = document.getElementById("rate_5" + (i + 1));
      if (el) { el.classList.add("red"); }
    }
  }
}

