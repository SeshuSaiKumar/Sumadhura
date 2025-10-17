import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {
 updateData: any = null;
  updateText: string = '';  // Dummy updates, match company-updates.page.ts
  // @ViewChild(Slides) slides: Slides;
  dataArray: any;
  mesg: any;
  descrip: any;
  receivedDat: any;
  notification_id: any;
  Images: any;
  commnurl_notification: string;
  fileLink: any;
  notificationView: any;
  statusid: any;
  imagegallery: any=[];
  multiattachments: any
  messeangerId : any
  likeCount : any
  outlineHand : boolean = true
  filledHand : boolean = false
  chaticon : boolean = true
  chaticon2 : boolean = false
  isLike: any;
  isRead: any;
  tempempId: any;

  constructor(private route: ActivatedRoute,private navParams: NavParams, private cmn: CommonService) {
    this.notification_id = navParams.get('id');
    console.log("id: "+ JSON.stringify(this.notification_id));
      let response =  this.notification_id;
      this.mesg = response.message;
    
          this.statusid = response.id;

  }

  ngOnInit() {
 this.route.queryParams.subscribe(params => {
      if (params['ticket']) {
        this.updateData = JSON.parse(params['ticket']);
        this.updateText = this.updateData.message || 'No Title';
        // You can also extract and assign other fields here
      }
    });
  }


likePost() {
  const url = this.cmn.commonservice + "notification/updateLikeStatus.spring";

  const body = {
    notificationId: this.statusid,
    flatBookingId: localStorage.getItem("flat_booking_id"),
    sessionKey: localStorage.getItem('sessionKey'),
    deviceId: localStorage.getItem("deviceTokenId"),
  };

  console.log("POST URL:", url);
  console.log("Request body:", JSON.stringify(body));

  return CapacitorHttp.post({
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: body,
  }).then(resp => {
    const response = resp.data;
    console.log("Like response: ", response);

    if (response.responseCode === "200") {
      this.outlineHand = false;  // Filled hand for liked
      this.filledHand = true;
      // Optionally alert success message
      // this.cmn.commonAlertfun(response.status);
    } else if (response.responseCode === "440") {
      this.cmn.presentAlert(response.status);
      return false;
    } else {
      this.cmn.presentAlert("Something went wrong! Please try again");
    }
  }).catch(err => {
    console.error("Like request error:", err);
    this.cmn.presentAlert("Please try again after some time");
  });
}

}
