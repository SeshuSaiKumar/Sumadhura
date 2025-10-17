import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';

@Component({
  selector: 'app-complaints-view',
  templateUrl: './complaints-view.page.html',
  styleUrls: ['./complaints-view.page.scss'],
})
export class ComplaintsViewPage implements OnInit {
chatresponse: any;
  assignedVal: any;
  discriptionval: any;
  campdfImgs: any;
  // hideimagescroll: boolean = false;
  ticketing_commonUrl: string;
  ticket_Id: any;
  status_Id: any;
  present_status: any;
  reopen_open: boolean;
  // currentDate_milliseconds: number;
  // resolvedate_addedhours: number;
  // isenabled: boolean = false;
  // isDisabled: boolean;
  present_title: any;
  escalationDate: any;
  // isenabled_attachment: boolean = false;
  // photos: any = [];
  // mypic: any;
  // cameragallery_extension: any = [];
  // public mbytesarray_cam: any = []
  // cameragallery: any = [];
  // fileInfo: any = [];
  // feedbackDesc: any;
  // ratingNum: any;
  ticketStatus: any;
  // disconnectSubscription: any;
  // base64StringLength: number;
  // inBytes: number;
  // kbytes: number;
  // Mbytes: number;
  // file_extension: any;
  // myfiles: any;
  // sendfile: any = [];
  enablereopen: any;
  // totmb_cam: any = 0;
  // array: Array<any> = [];
  // controllerdata: Array<any> = [];
  // maincontroller: Array<any> = [];
  // filename: any;
  // image: string | ArrayBuffer;
  ticketnum: any;
details: any;
  // _imageViewerCtrl: ImageViewerController;
  // tabBarElement: any;
  tictcomplint: any;
 
  resultoftwoarray: any[];
  re_open_date: any;
  complaint_Status: any;


    ticketData = {
    employee: 'CRM Finance Folium Ph3-CRM',
    type: 'Documents/Other Documents',
    reopen: '14/06/2025'
  };

    showModal = false;

  constructor(private loadingCtrl: LoaderService,private cmn: CommonService,private route: ActivatedRoute,
              
  ) { }

  ngOnInit() {
 this.route.queryParamMap.subscribe(params => {
      const ticketParam = params.get('ticket');
      if (ticketParam) {
        this.details = JSON.parse(ticketParam);
        console.log(this.details,"aaaaaaaaaaaaaa");
        
      }
    });
    this.getTicketDetails()

      console.log('DATA:', this.details);
  if (this.campdfImgs?.length > 0) {
    console.log('fileInfos[0].url:', this.campdfImgs[0].url);
    console.log('fileInfos[0].extension:', this.campdfImgs[0].extension);
  } else {
    console.log('No fileInfos or empty fileInfos array');
  }
  }

  getImageSource(fileUrl: string, extension: string): string {
  if (!fileUrl || fileUrl === 'N/A') {
    return 'assets/imgs/file1.png';
  }
  const ext = extension?.toLowerCase() || '';

  // Images use fileUrl directly
  if (['jpg', 'jpeg', 'png', 'svg'].includes(ext)) {
    return fileUrl;
  }

  // Other file types use icons
  const icons: { [key: string]: string } = {
    'pdf': 'assets/imgs/pdficon.png',
    'xlsx': 'assets/imgs/xlsxicon.png',
    'xlx': 'assets/imgs/xlsxicon.png',
    'doc': 'assets/imgs/wordicon.png',
    'docx': 'assets/imgs/wordicon.png',
    'txt': 'assets/imgs/txticon.jpg',
    'ppt': 'assets/imgs/pptxicon.png',
    'pptx': 'assets/imgs/pptxicon.png',
  };

  return icons[ext] || 'assets/imgs/file1.png';
}



   myimage(fileurl:any){
    window.open(fileurl, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
  }


  
 async getTicketDetails() {
    await this.loadingCtrl.showLoader();

    const url = this.cmn.commonservice + "customerTicket/getTicketDetails.spring";
    console.log("url--- :" + url);

    const body = {
      sessionKey: localStorage.getItem('sessionkey_afterlogin') || "",
      deviceToken: localStorage.getItem('deviceTokenId') || "null",
      ticketId: this.details.ticketId,
      statusId: this.details.statusId
    };
    console.log("Ticket details Data:" + JSON.stringify(body));

    const options = {
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    };

    try {
      const response = await CapacitorHttp.post(options);
      this.loadingCtrl.hideLoader();

      const resp = response.data;
      console.log("Ticket details Data:" + JSON.stringify(resp));
     
      this.chatresponse = resp.ticketResponseList[0].ticketComments;
      this.assignedVal = resp.ticketResponseList[0].assignedEmployee;
      this.discriptionval = resp.ticketResponseList[0].description;
      this.present_status = resp.ticketResponseList[0].status;
      this.enablereopen = resp.ticketResponseList[0].isTicketReopenEnable;
      this.present_title = resp.ticketResponseList[0].title;
      this.re_open_date = resp.ticketResponseList[0].reopenenDate;
      this.escalationDate = resp.ticketResponseList[0].estimatedResolvedDate;
      this.ticketStatus = resp.ticketResponseList[0].status;
      this.complaint_Status = resp.ticketResponseList[0].complaintStatus;
      this.campdfImgs = resp.ticketResponseList[0].fileInfos;
      this.ticketnum = resp.ticketId;
      this.reopen_open = true;

      // sessionStorage.setItem("feedbackmodalTicketId", this.ticket_Id);
      // sessionStorage.setItem("feedbackmodalpresenttitle", this.present_title);
      // sessionStorage.setItem("complaint_Status", this.complaint_Status);

      // if (resp.ticketResponseList[0].status == "Closed") {
      //   this.isenabled = false;
      //   this.isenabled_attachment = false;
      //   this.isDisabled = true;

      //   const d = new Date();
      //   const n = d.getTime();
      //   this.currentDate_milliseconds = n;

      //   const resoveDate = resp.ticketResponseList[0].resolvedDate;
      //   this.resolvedate_addedhours = parseInt(resoveDate) + 172800000;

      //   if (this.resolvedate_addedhours > n) {
      //     this.reopen_open = true;
      //   }
      // } else {
      //   this.isenabled = true;
      //   this.isenabled_attachment = true;
      //   this.isDisabled = false;
      // }
      // if (this.campdfImgs.length > 0) {
      //   this.hideimagescroll = true;
      // }

      if (resp.responseCode == 200) {
      this.loadingCtrl.hideLoader();
      } else if (resp.responseCode == 440) {
        // this.cmn.sessionTimeoutCommonAlertfun(resp.status);
        return false;
      } else {
        this.cmn.presentAlert(resp.status);
      }
    } catch (err: any) {
      this.loadingCtrl.hideLoader();

      if (err.status == 0) {
        this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
        return false;
      } else {
        this.cmn.presentAlert("Error in retrieving the data");
        return false;
      }
    }
  }

}