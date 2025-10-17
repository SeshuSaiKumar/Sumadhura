import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorHttp } from '@capacitor/core';
// import { NetworkPlugin } from '@capacitor/network';
import { AlertController, IonContent, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { Browser } from '@capacitor/browser';
import { ImageEditorModalPage } from 'src/app/image-editor-modal/image-editor-modal.page';
import { FileUploader } from 'ng2-file-upload';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
interface MyImage {
  base64: string;
  name: string;
  shouldAddTimestamp: boolean;
}
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: '',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'txt', 'video', 'doc', 'xls', 'xlsx', 'docx', 'audio', 'ppt', 'pptx']
  });
  currentIndex: number = -1;

  @ViewChild('groupmodal', { static: false }) groupmodal: any;
    activeSegment = 'all';
  ticketslist: any;
  refresh_data: boolean = false;
  resolutionDay_Time: any;
  StatusChanged: any;
  purpose_name: any
  mypurposeres: any;
  purposetype: any;
  mySubPurposeType: any = [];
  subpurposetype: any;
  sub_purpose_name: any;
  ticketType: string;
  array: any = [];
    mesag: any;
  public fileInfo: any = [];
  controllerdata: MyImage[] = [];
  maincontroller: MyImage[] = [];
  image_controller_upload: any[] | any;

  hidepdf: boolean = true;
  hideimg: boolean = true;
  photos: any = [];
  sendfile: any = [];
  file_extension: any = [];
  myfiles: any = [];
  cameragallery_extension: any = [];
  cameragallery: any = [];
  resultoftwoarray: any = [];
  ticket: string = "mt";
  @ViewChild(IonContent, { static: false }) content: IonContent;

  
  constructor(
      // public ajaxCall: CommonService,
      // private device: Device,
      // private network: NetworkPlugin,
      // private iab: InAppBrowser,
      private loaderService: LoaderService,
      private modalCtrl: ModalController,
      private cmn: CommonService,
      public navCtrl: NavController,
      // public navParams: NavParams,
      private router: Router,
      private alertController: AlertController,
      public platform: Platform,) {
         this.reset();

       }


  ngOnInit() {
        this.purposeType();
 this.reset();
  }

  private reset() {
     this.activeSegment = 'all';
    this.myTicketsList();
  }



  // doRefresh(event) {
  //   this.purposetype = "";
  //   this.mesag = "";
  //   this.photos = [];
  //   this.sendfile = [];
  //   this.fileInfo = [];
  //   this.file_extension = [];
  //   this.myfiles = [];
  //   this.cameragallery_extension = [];
  //   this.cameragallery = [];
  //   this.maincontroller = [];
  //   this.resultoftwoarray = [];
  //   this.hidepdf = true;
  //   this.hideimg = true;
  //   this.myTicketsList();
  //   event.complete();
  // }

 

  ionViewDidLoad() {

    this.purposetype = "";
    this.mesag = "";
    this.photos = [];
    this.sendfile = [];
    this.fileInfo = [];
    this.file_extension = [];
    this.myfiles = [];
    this.cameragallery_extension = [];
    this.cameragallery = [];
    this.maincontroller = [];
    this.resultoftwoarray = [];
    this.hidepdf = true;
    this.hideimg = true;
    this.myTicketsList();
    

   
    
  }
  ionViewWillEnter() {
    // this.tabBarElement.style.display = 'none';

    this.purposetype = "";
    this.mesag = "";
    this.photos = [];
    this.sendfile = [];
    this.fileInfo = [];
    this.file_extension = [];
    this.myfiles = [];
    this.cameragallery_extension = [];
    this.cameragallery = [];
    this.maincontroller = [];
    this.resultoftwoarray = [];
    this.hidepdf = true;
    this.hideimg = true;
    this.myTicketsList();
  }

  ionViewWillLeave() {
    // this.tabBarElement.style.display = 'flex';

    this.purposetype = "";
    this.mesag = "";
    this.photos = [];
    this.sendfile = [];
    this.fileInfo = [];
    this.file_extension = [];
    this.myfiles = [];
    this.cameragallery_extension = [];
    this.cameragallery = [];
    this.maincontroller = [];
    this.resultoftwoarray = [];
    this.hidepdf = true;
    this.hideimg = true;
    this.myTicketsList();
  }



  groupmdl() {

      this.groupmodal.present();
    }
  handleDismiss(modalName: string) {
    if (modalName === 'groupmodal' && this.groupmodal) {
      this.groupmodal.dismiss();
    }
    // Add other modals if needed
  }
  dismissModal() {
    this.groupmodal.dismiss();
  }
 gotoTicketDetails(ticket: any) {
  this.router.navigate(['/view-ticket'], {
    queryParams: { ticket: JSON.stringify(ticket) }
  });
}


  async myTicketsList() {
  this.loaderService.showLoader();

  const options = {
    url: this.cmn.commonservice + "customerTicket/getCustomerRaisedTicketList.spring",
    headers: { 'Content-Type': 'application/json' },
    data: {
      deviceToken: this.cmn.deviceToken,
      sessionKey: localStorage.getItem("sessionkey") || ''
    }
  };

  try {
    const response = await CapacitorHttp.post(options);
    this.loaderService.hideLoader();

    // The CapacitorHttp plugin returns response.data as a string, so parse if needed
    let resp = response.data;
    if (typeof resp === 'string') {
      resp = JSON.parse(resp);
    }

    if (resp.responseCode === 200) {
      this.ticketslist = resp.ticketResponseList;
        console.log(resp);
                  this.mesag = "";

      if (this.refresh_data === true) {
        const currentCount = localStorage.getItem("demo");
        const newCount = resp.ticketResponseList.length;

        // if (currentCount === null) {
        //   this.ticket = "mt";
        // } else if (newCount > parseInt(currentCount)) {
        //   this.ticket = "rk";

          // this.purposetype = "";
          // this.subpurposetype = "";
          // this.mySubPurposeType = "";
        //   this.mesag = "";
        //   this.photos = [];
        //   this.sendfile = [];
          this.image_controller_upload = [];
        //   this.file_extension = [];
        //   this.myfiles = [];
        //   this.cameragallery_extension = [];
        //   this.controllerdata = [];
        //   this.array = [];
        //   this.cameragallery = [];
        //   this.uploader.queue = [];
        //   this.resultoftwoarray = [];
        //   this.maincontroller = [];
        //   this.hidepdf = true;
        //   this.hideimg = true;
        // } else {
        //   this.ticket = "mt";
        // }

        localStorage.setItem("demo", newCount.toString());
      }

      // if (this.from_previous_page === "true") {
      //   this.ticket = "rk";
      // }

    } else if (resp.responseCode === 440) {
      this.cmn.presentAlert(resp.status);
      // this.platform.exitApp();
      return false;
    } else {
      // Handle other errors if needed
      // this.cmn.commonAlertfun("something went wrong! Please try again");
    }

  } catch (err) {
  this.loaderService.hideLoader();

  const error = err as { status?: number };

  if (error.status === 0) {
    this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
    return false;
  }

  this.cmn.presentAlert("Please try again after some time");
  return false;
}
  }

  async purposeType() {
  // // const loader = await this.loadingCtrl.create({});
  // await loader.present();

  const url = this.cmn.commonservice + "customerTicket/getTicketTypeDetails.spring";

  const body = {
    "sessionKey": localStorage.getItem('sessionkey'),
    "deviceToken": localStorage.getItem("deviceTokenId"),
  };

  const options = {
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: body
  };

  try {
    const response = await CapacitorHttp.post(options);
    console.log("purpose type :" + JSON.stringify(response.data));
    // await loader.dismiss();

    if (response.data.responseCode == 200) {
      let mydata = JSON.stringify(response.data);
      this.mypurposeres = response.data.ticketTypeResponses;
    } else {
      this.cmn.presentAlert(response.data.status);
      // this.getTicketDetails();
    }
    // Optionally handle resolution time here
    // sessionStorage.setItem('resoluation_time', response.data.ticketTypeResponses.resolutionDayTime);
  } catch (err) {
    // await loader.dismiss();
    // this.cmn.commonAlertfun("Error in retrieving the data");
    return false;
  }
}
purposeChange(event: any) {
  const value = event.detail.value; // 'item' object from purposetype select
  console.log("Purpose Changed:", value);
  this.purposetype = value;
  this.mySubPurposeType = value.ticketTypeResponseList;
  console.log("Sub Purpose Options:", this.mySubPurposeType);
  
  this.purpose_name = value.ticketMainType;
  // If needed, trigger sub-purpose population here using value.ticketMainType or value.ticketTypeId
}

onchange(event: any) {
  const value = event.detail.value; // comma-separated string from subpurposetype select
  console.log("Sub Purpose Changed:", value);
  if (value) {
    const parts = value.split(',');
    this.StatusChanged = parts[0];           // ticketTypeId
    this.sub_purpose_name = parts[1];        // ticketType
    this.resolutionDay_Time = parts[2];      // resolutionDayTime
    this.ticketType = (this.purposetype.ticketMainType || "") + " / " + this.sub_purpose_name;
    console.log("Selected Sub Purpose:", this.StatusChanged, this.sub_purpose_name, this.resolutionDay_Time);
    
  }
}


async submitFun() {
  // this.fileInfo = [];

  // Input validations
  if (!this.purposetype) {
    this.cmn.presentAlert("Please choose your query");
    return false;
  }
  if (!this.subpurposetype) {
    this.cmn.presentAlert("Please select specifics");
    return false;
  }
  if (!this.mesag) {
    this.cmn.presentAlert("Please enter the comments");
    return false;
  }
  if (this.mesag.length > 2000) {
    this.cmn.presentAlert("Your comments should be less than 2000 characters.");
    return false;
  }
if (this.maincontroller == undefined && this.controllerdata == undefined || this.maincontroller.length == 0 && this.controllerdata.length == 0) {
      this.image_controller_upload = null;

    } else if (this.maincontroller == undefined || this.maincontroller.length == 0) {
      this.image_controller_upload = this.controllerdata;

    } else if (this.controllerdata == undefined || this.controllerdata.length == 0) {
      this.image_controller_upload = this.maincontroller;


    }  else if (this.controllerdata.length != 0 || this.controllerdata.length != 0) {
      this.image_controller_upload = this.maincontroller;

    }
  // Prepare fileInfo array for API
  // for (let i = 0; i < this.resultoftwoarray.length; i++) {
  //   this.fileInfo.push({
  //     id: i.toString(),
  //     name: this.resultoftwoarray[i].filename,
  //     base64: this.resultoftwoarray[i].base64
  //   });
  // }

  // Show loader (await pattern for Ionic 7+)
  await this.loaderService.showLoader();

  // Prepare request
  const url = this.cmn.commonservice + "customerTicket/createCustomerServiceRequest.spring";
  const body = {
    sessionKey: localStorage.getItem('sessionkey'),
    deviceToken: localStorage.getItem("deviceTokenId"),
    ticketTypeId: this.StatusChanged,
    title: this.ticketType,
    description: this.mesag,
    fileInfo: this.image_controller_upload,
    resolutionDayTime: this.resolutionDay_Time
  };
  const options = {
    url,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    data: body
  };

  try {
    const response = await CapacitorHttp.post(options);
    
    if (response.data.responseCode === 200) {
      await this.loaderService.hideLoader();
       this.activeSegment = 'all';
       this.content.scrollToTop(300); // 300ms animation

      this.modalCtrl.dismiss();
      this.cmn.presentAlert(response.data.status);
      this.purposetype = "";
      this.subpurposetype = "";
      this.mySubPurposeType = "";
      this.mesag = "";
      this.photos = [];
      this.sendfile = [];
      this.image_controller_upload = [];
      this.file_extension = [];
      this.myfiles = [];
      this.cameragallery_extension = [];
      this.controllerdata = [];
      this.array = [];
      this.cameragallery = [];
      this.uploader.queue = [];
      this.resultoftwoarray = [];
      this.maincontroller = [];
      this.controllerdata = [];
      this.hidepdf = true;
      this.hideimg = true;
      this.myTicketsList();
    } else if (response.data.responseCode === 1001) {
      this.cmn.presentAlert(response.data.errors[0]);
    } else if (response.data.responseCode === 440) {
      this.cmn.presentAlert(response.data.status);
      // this.platform.exitApp();
      return false;
    } else {
      this.cmn.presentAlert(response.data.status);
    }

  } catch (err: any) {
    await this.loaderService.hideLoader();
    this.cmn.presentAlert("Unable to connect to server, Something seems to be wrong.");
    this.purposetype = "";
    this.mesag = "";
    this.photos = [];
    this.sendfile = [];
    this.image_controller_upload = [];
    this.file_extension = [];
    this.myfiles = [];
    this.cameragallery_extension = [];
    this.cameragallery = [];
    this.controllerdata = [];
    this.hidepdf = true;
    this.hideimg = true;
    return false;
  }
}

async uploadWebFun() {
  let prop_type = this.purposetype;
  if (!prop_type) {
    this.cmn.presentAlert("Please choose your query");
    return false;
  }

  let sub_purp_type = this.subpurposetype;
  if (!sub_purp_type) {
    this.cmn.presentAlert("Please select specifics");
    return false;
  }

  let message = this.mesag;
  if (!message) {
    this.cmn.presentAlert("Please enter the comments");
    return false;
  }
  if (message.length > 2000) {
    this.cmn.presentAlert("Your comments should be less than 2000 characters.");
    return false;
  }

  const params = {
    sessionKey: localStorage.getItem('sessionkey_afterlogin'),
    deviceToken: localStorage.getItem("deviceTokenId"),
    ticketTypeId: this.StatusChanged,
    title: this.ticketType,
    description: this.mesag,
    resolutionDayTime: this.resolutionDay_Time,
    type: this.purpose_name,
    subtype: this.sub_purpose_name
  };

  const encodedParams = btoa(JSON.stringify(params));
  const secureUrl = this.cmn.commonservice + `?token=${encodedParams}`;

  // Optional: If backend expects a POST, use CapacitorHttp first
  // let response = await CapacitorHttp.post({
  //   url: this.cmn.commonservice,
  //   headers: { 'Content-Type': 'application/json' },
  //   data: params
  // });

  // Open popup using Capacitor Browser plugin
  await Browser.open({ url: secureUrl });

  // For refresh logic after browser closes, use Browser events
  Browser.addListener('browserFinished', () => {
    console.log('Popup browser closed');
    this.myTicketsList();
    this.refresh_data = true;
  });
this.modalCtrl.dismiss();
}

async onFileSelected(event: any) {
  const files: FileList = (event.target as HTMLInputElement).files!;
  if (!files || files.length === 0) return;

  this.controllerdata = this.controllerdata || [];
  this.maincontroller  = this.maincontroller  || [];

  const invalidAudioTypes = [
    "audio/mpeg", "audio/mp3", "audio/mp4", "audio/acc", "audio/ogg"
  ];
  const invalidVideoTypes = [
    "video/mp4", "video/avi", "video/mov", "video/mpg", "video/ogg",
    "video/webm", "video/mp2", "video/mpeg", "video/mpe",
    "video/mpv", "video/m4v", "video/wmv", "video/qt",
    "video/flv", "video/swf", "video/avchd"
  ];

  const tasks: Promise<void>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const ft = file.type.toLowerCase();
    if (!ft || invalidAudioTypes.includes(ft) || invalidVideoTypes.includes(ft)) {
      this.cmn.presentAlert(`Unsupported format: "${file.name}"`);
      continue;
    }

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > 20) {
      this.cmn.presentAlert(`"${file.name}" exceeds 20 MB (${sizeMB.toFixed(1)}MB)`);
      continue;
    }

    tasks.push(
      this.getBase64(file).then(base64 => {
        const img: MyImage = {
          base64,
          name: file.name,
          shouldAddTimestamp: false
        };
        this.controllerdata.push(img);
        this.maincontroller.push(img);
      }).catch(err => {
        console.error(`Error reading "${file.name}":`, err);
        this.cmn.presentAlert(`Could not read "${file.name}".`);
      })
    );
  }

  await Promise.all(tasks);

  if (this.uploader) {
    this.uploader.queue = [];
  }

  const lastIdx = this.maincontroller.length - 1;
  if (lastIdx >= 0) {
    this.openSliderEditor(this.maincontroller, lastIdx, false);
  }
}


// 2) selectImage: camera capture, **with** timestamp


// 3) getBase64: pure File → dataURL conversion
getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file); // Converts file to base64 encoded string
  });
}


async selectImage(source: 'camera' | 'photos') {
  if (source !== 'camera') return;

  this.controllerdata = this.controllerdata || [];
  this.maincontroller = this.maincontroller || [];

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      saveToGallery: false,
      source: CameraSource.Camera
    });

    const camName = `camera_${Date.now()}.jpeg`;

    const img: MyImage = {
      base64: photo.dataUrl!,
      name: camName,
      shouldAddTimestamp: true
    };
    if (this.currentIndex >= this.maincontroller.length) {
      this.currentIndex = this.maincontroller.length - 1;
    }

    // Insert camera image after currentIndex instead of pushing
const insertAt = this.currentIndex >= 0 ? this.currentIndex + 1 : this.maincontroller.length;

    this.controllerdata.splice(insertAt, 0, img);
    this.maincontroller.splice(insertAt, 0, img);

    // Move currentIndex to new image
    this.currentIndex = insertAt;

    this.openSliderEditor(this.maincontroller, this.currentIndex, true);

  } catch (err) {
    console.error('Camera error:', err);
    this.cmn.presentAlert('Could not capture image.');
  }
}



// 4) openSliderEditor: stamp only the passed‐in index
async openSliderEditor(images: MyImage[], index: number, addTimestamp: boolean) {
  try {
    // await this.modalCtrl.dismiss();
  } catch {
    // No modal to dismiss
  }
  const clonedImages: MyImage[] = images.map(img => ({
    base64: img.base64,
    name: img.name,
    shouldAddTimestamp: img.shouldAddTimestamp
  }));
  const modal = await this.modalCtrl.create({
    component: ImageEditorModalPage,
    componentProps: {
      images: clonedImages,
      currentIndex: index,
      stampIndex: addTimestamp ? index : -1
    },
    cssClass: 'custom-modal'
  });

  // 4) After dismissal, merge any edits back into maincontroller
  modal.onDidDismiss().then(result => {
    const edited: MyImage[] = result.data?.editedImages || [];
    edited.forEach((e, i) => {
      if (e?.base64) {
        this.maincontroller[i].base64 = e.base64;
        this.maincontroller[i].name   = e.name;
        // if desired, also sync shouldAddTimestamp:
        // this.maincontroller[i].shouldAddTimestamp = e.shouldAddTimestamp;
      }
    });
  });

  // 5) Present the newly created modal
  await modal.present();
}




removeItem1(i: number) {
  this.controllerdata.splice(i, 1);
  this.maincontroller.splice(i, 1);

  // Adjust currentIndex safely
  if (this.currentIndex >= this.maincontroller.length) {
    this.currentIndex = this.maincontroller.length - 1;
  }
}

}