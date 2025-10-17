import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CapacitorHttp } from '@capacitor/core';
import { ActionSheetController, AlertController, IonContent, LoadingController, ModalController, NavController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { ZoomImgComponent } from 'src/app/components/zoom-img/zoom-img.component';
import { ImageEditorModalPage } from 'src/app/image-editor-modal/image-editor-modal.page';
import { LoaderService } from 'src/app/LoaderService';
import { Keyboard } from '@capacitor/keyboard';


interface MyImage {
  base64: string;
  name: string;
  shouldAddTimestamp: boolean;
}
@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.page.html',
  styleUrls: ['./view-ticket.page.scss'],
})
export class ViewTicketPage implements OnInit {
viewImagesModalOpen = false; // ✅ Controls modal visibility
ImagesModalOpen = false; // ✅ Controls modal visibility
  isenabled: boolean = false;
  isDisabled: boolean;
 currentDate_milliseconds: number;
  resolvedate_addedhours: number;
    hideimagescroll: boolean = false;

chatresponse: any;
  assignedVal: any;
  discriptionval: any;
  campdfImgs: any;
  ticketing_commonUrl: string;
  ticket_Id: any;
  status_Id: any;
  present_status: any;
  reopen_open: boolean;
  present_title: any;
  escalationDate: any;
  ticketStatus: any;
  enablereopen: any;
  ticketnum: any;
  details: any;
  tictcomplint: any = '';
  resultoftwoarray: any[];
  re_open_date: any;
  complaint_Status: any;


    ticketData = {
    employee: 'CRM Finance Folium Ph3-CRM',
    type: 'Documents/Other Documents',
    reopen: '14/06/2025'
  };

    showModal = false;

   @ViewChild(ZoomImgComponent, { static: false }) zoomImgComp!: ZoomImgComponent;
   selectedImage: string | null = null;


      @ViewChild('messageEnd') messageEnd: ElementRef;
    
      public uploader: FileUploader = new FileUploader({
        url: '',
        disableMultipart: false,
        autoUpload: true,
        method: 'post',
        itemAlias: 'attachment',
        allowedFileType: ['image', 'pdf', 'txt', 'video', 'doc', 'xls', 'xlsx', 'docx', 'audio', 'ppt', 'pptx']
    
      });
    
      @ViewChild('popover') popover: any;
      popover_text: string;
      //loader_hideme: boolean;
      subscription: Subscription;
      intervalId: number;
      [x: string]: any;
      modal: HTMLIonModalElement;
      data: any;
      data_url: any;
      approve_change: any;
      chat_task_id: any;
      chat_details_message: Array<any> = [];
      chat_details_frq: Array<any> = [];
      subject: any;
      Description: any;
      createdbyId: any;
      employee_id: any;
      type_your_message: any;
      controllerdata: any;
      array: any[];
      path: string;
      filename: string;
      fileUploadName: string;
      maincontroller: Array<any> = [];
      image: any;
      image_controller: any[];
      imagepic: any;
      padding: number;
      base64StringLength: number;
      inBytes: number;
      kbytes: number;
      Mbytes: number;
      totmb_cam: string;
      image_controller_upload: any[] | any;
      taskToTypeEmpIdsList: any;
      taskToTypeEmpId: any;
      taskCreatedByEmpId: any;
      navigationSubscription = new Subscription();
      fileName: string;
      theActualPicture: string | undefined;
      delete_hideme: boolean;
      isOpen = false;
    
      copy_hideme: any;
      share_hideme: any;
      view_hideme: any;
      delete_item: any;
      view_image: any;
      delete_status: any;
      attachment_sta: any;
      taskStatus: any;
      taskType:any;
      taskStatusId:any;
      login_employee_id: any;
      taskToTypeEmpId_val: any;
      taskResponceEmpId: any;
      status_name: any;
      edit_hideme: boolean;
      edit_status: any;
      taskConversationId: any;
      modified: any;
      sub_url: any;
      approve_text: any;
      reject_text: any;
      loginhere: boolean = false;
      reject: any;
      users: any;
  isenabled_attachment: boolean = false;
@ViewChild('footer', { static: true, read: ElementRef })
footer: ElementRef;
  @ViewChild('chatContent', { static: false }) content: IonContent;
      @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;
  messages: any[] = [];
  messageText : string = '';
 private readonly lineHeight = 24; // Height per line
  private readonly minHeight = 24;  // Single line height
  private readonly maxLines = 5;    // Maximum 5 lines
  private readonly maxHeight = this.lineHeight * this.maxLines; // 120px for 5 lines
  
      constructor(public fb: FormBuilder, private alertController: AlertController,
        private platform: Platform, private router: Router, public common: CommonService,
        public loadingController: LoadingController, private actionSheetController: ActionSheetController, private el: ElementRef,
        private toastController: ToastController, public navCtrl: NavController, public modalCtrl: ModalController,
        public activatedRoute: ActivatedRoute, public popoverController: PopoverController,
        private loaderService: LoaderService, 
          // public ajaxCall: CommonService,
          // private device: Device,
          // private network: NetworkPlugin,
          // public navParams: NavParams,
          private loadingCtrl: LoaderService,private cmn: CommonService,private route: ActivatedRoute,
    private sanitizer: DomSanitizer,private alertCtrl: AlertController,    private loadingalert: LoadingController,

  ) { 

     this.getTicketDetails()
  }

  ngOnInit() {

 Keyboard.addListener('keyboardDidShow', (info) => {
    const actionsRow = document.querySelector('.actions-row') as HTMLElement;
    if (actionsRow) {
      actionsRow.style.transform = `translateY(-${info.keyboardHeight}px)`;
    }
  });

  Keyboard.addListener('keyboardDidHide', () => {
    const actionsRow = document.querySelector('.actions-row') as HTMLElement;
    if (actionsRow) {
      actionsRow.style.transform = 'translateY(0)';
    }
  });





  this.route.queryParamMap.subscribe(params => {
      const ticketParam = params.get('ticket');
      if (ticketParam) {
        this.details = JSON.parse(ticketParam);
        console.log(this.details,"aaaaaaaaaaaaaa");
        
      }
    });
    this.getTicketDetails()
      console.log('DATA:', this.details);
  if (this.campdfImgs?.length > 0) {0
    console.log('fileInfos[0].url:', this.campdfImgs[0].url);
    console.log('fileInfos[0].extension:', this.campdfImgs[0].extension);
  } else {
    console.log('No fileInfos or empty fileInfos array');
  }
  }



  ngAfterViewInit() {
    // Initialize textarea to single line height
    this.initializeTextareaHeight();
  }
   private async initializeTextareaHeight() {
    if (this.messageInput) {
      const textarea = await this.messageInput.nativeElement.getInputElement();
      textarea.style.height = this.minHeight + 'px';
      textarea.style.minHeight = this.minHeight + 'px';
      textarea.style.maxHeight = this.maxHeight + 'px';
      textarea.style.overflowY = 'hidden';
      textarea.style.resize = 'none';
    }
  }
  getImageSource(fileUrl: string, extension: string): string {
    console.log('getImageSource called with:', { fileUrl, extension });
    
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

imageViewModal() {
  if (this.campdfImgs?.length > 0) {
    this.viewImagesModalOpen = true;
  }
}
  scrollToBottom() {
  this.content.scrollToBottom(100); // 100ms animation duration
}
 async getTicketDetails() {
    await this.loadingCtrl.showLoader();

    const url = this.cmn.commonservice + "customerTicket/getTicketDetails.spring";
    console.log("url--- :" + url);

    const body = {
      sessionKey: localStorage.getItem('sessionkey') || "",
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
  setTimeout(() => {
    this.content.scrollToBottom(100); // 300 ms animation
  }, 100);
      const resp = response.data;
      console.log("Ticket details Data:",resp);
     
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
      console.log(this.campdfImgs,"iiiiiiiiiiiii");
      
      this.ticketnum = resp.ticketId;
      this.reopen_open = true;

      sessionStorage.setItem("feedbackmodalTicketId", this.ticket_Id);
      sessionStorage.setItem("feedbackmodalpresenttitle", this.present_title);
      sessionStorage.setItem("complaint_Status", this.complaint_Status);

      if (resp.ticketResponseList[0].status == "Closed") {
        this.isenabled = false;
        this.isenabled_attachment = false;
        this.isDisabled = true;

        const d = new Date();
        const n = d.getTime();
        this.currentDate_milliseconds = n;

        const resoveDate = resp.ticketResponseList[0].resolvedDate;
        this.resolvedate_addedhours = parseInt(resoveDate) + 172800000;

        if (this.resolvedate_addedhours > n) {
          this.reopen_open = true;
        }
      } else {
        this.isenabled = true;
        this.isenabled_attachment = true;
        this.isDisabled = false;
      }
      if (this.campdfImgs.length > 0) {
        this.hideimagescroll = true;
      }

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





  
  
  
    
  
  async onFileSelected(event: any) {
  console.log('Multiple file selection triggered');
  const files: FileList = (event.target as HTMLInputElement).files!;
  if (!files || files.length === 0) return;

  // initialize arrays if needed
  this.controllerdata = this.controllerdata || [];
  this.maincontroller   = this.maincontroller   || [];

  const invalidAudio = ["audio/mpeg","audio/mp3","audio/mp4","audio/acc","audio/ogg"];
  const invalidVideo = ["video/mp4","video/avi","video/mov","video/mpg","video/ogg",
    "video/webm","video/mp2","video/mpeg","video/mpe","video/mpv","video/m4v",
    "video/wmv","video/qt","video/flv","video/swf","video/avchd"];

  const uploads: Promise<void>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ft   = file.type.toLowerCase();

    if (!file || ft === "" || invalidAudio.includes(ft) || invalidVideo.includes(ft)) {
      this.common.presentAlert(`Unsupported format: "${file.name}"`);
      continue;
    }
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > 20) {
      this.common.presentAlert(`"${file.name}" exceeds 20 MB (${sizeMB.toFixed(1)} MB)`);
      continue;
    }

    uploads.push(
      this.getBase64(file).then(base64 => {
        const img: MyImage = {
          base64,
          name: file.name,
          shouldAddTimestamp: false    // NO timestamp for file‑selected
        };
        this.controllerdata.push(img);
        this.maincontroller.push(img);
      })
    );
  }

  // wait for all reads
  await Promise.all(uploads);

  // clear file‑uploader queue if used
  this.uploader.queue = [];

  // open slider on the newest file (no timestamp)
  const last = this.maincontroller.length - 1;
  if (last >= 0) {
    this.openSliderEditor(this.maincontroller, last, false);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// getBase64: pure DataURL conversion
// ─────────────────────────────────────────────────────────────────────────────
getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload  = () => {
      let result = reader.result as string;
      if (!result.startsWith('data:image')) {
        const mime = file.type || 'image/jpeg';
        result = `data:${mime};base64,${btoa(result)}`;
      }
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// selectImage: Camera capture, WITH timestamp
// ─────────────────────────────────────────────────────────────────────────────
async selectImage(source: 'camera' | 'photos') {
  if (source !== 'camera') return;

  this.controllerdata = this.controllerdata || [];
  this.maincontroller   = this.maincontroller   || [];

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      saveToGallery: false,
      source: CameraSource.Camera
    });

    const tsName = `camera_${Date.now()}.jpg`;
    const img: MyImage = {
      base64: photo.dataUrl!,
      name: tsName,
      shouldAddTimestamp: true     // ONLY camera images
    };

    this.controllerdata.push(img);
    this.maincontroller.push(img);

    const last = this.maincontroller.length - 1;
    this.openSliderEditor(this.maincontroller, last, true);

  } catch (err) {
    console.error('Camera error', err);
    this.common.presentAlert('Could not capture image.');
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// openSliderEditor: wrap each image so only the one at `index` stamps itself
// ─────────────────────────────────────────────────────────────────────────────
openSliderEditor(
  images: { base64: string; name: string; }[],
  index: number,
  addTimestamp: boolean
) {
  // wrap with per‑image flag
  const wrapped: MyImage[] = images.map((img, i) => ({
    base64: img.base64,
    name:   img.name,
    shouldAddTimestamp: addTimestamp && i === index
  }));

  this.modalCtrl.create({
    component: ImageEditorModalPage,
    componentProps: {
      images: wrapped,
      currentIndex: index
    },
    cssClass: 'custom-modal'
  }).then(modal => {
    modal.onDidDismiss().then(result => {
      if (result.data?.editedImages) {
        // merge edits back
        result.data.editedImages.forEach((edited: MyImage, i: number) => {
          if (edited?.base64) {
            this.maincontroller[i] = edited;
          }
        });
      }
    });
    modal.present();
  });
}


    
  
    chatSubmit() {
  
          if (this.tictcomplint == "" || this.tictcomplint == undefined) {
      this.cmn.presentAlert("please type complaint on this ticket");
      return false;
    }

  //  if (this.maincontroller == undefined && this.controllerdata == undefined || this.maincontroller.length == 0 && this.controllerdata.length == 0) {
  //     this.image_controller_upload = null;

  //   } else if (this.maincontroller == undefined || this.maincontroller.length == 0) {
  //     this.image_controller_upload = this.controllerdata;

  //   } else if (this.controllerdata == undefined || this.controllerdata.length == 0) {
  //     this.image_controller_upload = this.maincontroller;


  //   }  else if (this.controllerdata.length != 0 || this.controllerdata.length != 0) {
  //     this.image_controller_upload = this.maincontroller;

  //   }
  
      
  
  
  
      // if (this.image_controller_upload.length == 0) {
      //   if (this.type_your_message == undefined || this.type_your_message == "" || this.type_your_message == "undefined") {
      //     this.common.presentAlert("Please type your message");
      //     return false;
      //   }
  
      // }
  
        
  
      // if (this.type_your_message == undefined || this.type_your_message == "" || this.type_your_message == "undefined") {
      //   this.type_your_message = " ";
      // }
  
  
      // var d = new Date();
  
      // var datestring_create = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      //   ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + '00';
  
  
  
  
  
  
      //this.loader_hideme = true;
      this.loaderService.showLoader();
      const options = {
        url: this.common.commonservice + "customerTicket/chatSubmit.spring",
        headers: { 'Content-Type': 'application/json' },
        data: {
      ticketId: this.details.ticketId,
      sessionKey:  localStorage.getItem('sessionKey'),
      requestUrl: "chatSubmit.spring",
      deviceToken: localStorage.getItem("deviceTokenId"),
      title:  this.tictcomplint,
      fileInfo: this.image_controller_upload
  
        },
      };
  
      console.log(options.data);
      
      //  this.loaderService.showLoader();
      return CapacitorHttp.post(options).then(response => {
        if (response.data.responseCode == 200) {
          this.loaderService.hideLoader();
          //this.loader_hideme = false;
         this.getTicketDetails();
          this.tictcomplint = "";
          this.controllerdata = [];
          this.maincontroller = [];
          this.resetTextareaHeight();
          // this.scrollToBottom();
          // this.chat_details();
          return false;
  
  
        } else if (response.data.responseCode == 700) {
          this.loaderService.hideLoader();
          this.common.presentAlert(response.data.errors[0]);
          return false;
        } else if (response.data.responseCode == 800) {
          this.loaderService.hideLoader();
          this.common.presentAlert(response.data.errors[0]);
          return false;
        } else {
          this.loaderService.hideLoader();
          this.common.presentAlert(response.data.errors[0]);
          return false;
        }
      }).catch(err => {
        this.loaderService.hideLoader();
        this.common.presentAlert('Internal server error.');
        return false;
      });
    }
  
  
  
    myimage2(fileurl: any, item: any) {
  
      this.delete_item = fileurl;
      this.delete_status = item;
  
      this.copy_hideme = false;
      this.share_hideme = false;
      this.view_hideme = true;
  
  
  
      this.view_image = fileurl.docLocaton;
      this.isOpen = true;
  
      if (item.createdbyId == localStorage.getItem("mpinhandle")) {
        this.delete_hideme = true;
      } else {
        this.delete_hideme = false;
      }
  
  
  
    }
  
    view_text(fileurl: any) {
      window.open(fileurl, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
    }
  
  
  
  
    async copy_option(text: string) {
  
  
      try {
        // Create a temporary input element
        const tempInput = document.createElement('input');
        // Set its value to the text you want to copy
        tempInput.value = text;
        // Append it to the DOM
        document.body.appendChild(tempInput);
        // Select the text in the input element
        tempInput.select();
        // Execute the copy command
        const successful = document.execCommand('copy');
        // Remove the temporary input element
        document.body.removeChild(tempInput);
  
        // Show success message if copy was successful
        if (successful) {
  
          //  this.common.presentToast("Text copied to clipboard");
          // await Toast.show({
          //   text: 'Text copied to clipboard',
          //   duration: 'short'
          // });
  
          this.isOpen = false;
        } else {
          throw new Error('Failed to copy text');
        }
      } catch (error) {
        // Show error message if copy failed
        console.error('Error copying text:', error);
        //this.common.presentToast('Error copying text:');
        // await Toast.show({
        //   text: 'Failed to copy text',
        //   duration: 'short'
        // });
      }
  
    }
  
   removeItem1(i: number) {
  // 1) remove from both lists
  this.maincontroller.splice(i, 1);
  this.controllerdata.splice(i, 1);

  // 2) if you’ve emptied them out, close the modal
  if (this.maincontroller.length < 1 && this.controllerdata.length < 1) {
    this.ImagesModalOpen = false;
  }
}
gotoRating(){
  this.router.navigate(['/ratings']);
}

onImageClick(url: string) {
  this.selectedImage = url;
  this.zoomImgComp.openModal();
}

 private isTicketValid(): boolean {
    return !!(this.details && this.details.ticketId);
  }

  private showCustomAlert(message: string): void {
    this.alertCtrl.create({
      header: 'SUMADHURA',
      message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }


  onInputChange(event: any) {

    const value = event.target.value;
    if (value && value.length > 0) {
      // Capitalize the first letter and keep the rest of the value as is
      this.type_your_message = value.charAt(0).toUpperCase() + value.slice(1);
    }


  }

  async reOpen() {
  if (!this.isTicketValid()) {
    this.showCustomAlert('Ticket information is missing or invalid.');
    return;
  }

  const alert = await this.alertCtrl.create({
    header: 'SUMADHURA',
    message: 'Do you want to Reopen the ticket?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Reopen',
        handler: async () => {
          const loader = await this.loadingalert.create({ message: 'Reopening ticket...' });
          await loader.present();

          try {
            const url = this.common.commonservice + "customerTicket/reOpenTicket.spring"; // Replace with your API
            const body = {
              ticketId: String(this.details.ticketId),
              requestUrl: 'reOpenTicket.spring',
              sessionKey: localStorage.getItem('sessionkey') ?? '',
              deviceToken: localStorage.getItem('deviceTokenId') ?? '',
            };

            const response = await CapacitorHttp.post({
              url,
              headers: { 'Content-Type': 'application/json' },
              data: body
            });

            await loader.dismiss();
            const resp = response.data;

            if (!resp) {
              this.showCustomAlert('Invalid server response.');
              return;
            }

            if (resp.responseCode === 200) {
              this.showCustomAlert(resp.status);
              this.router.navigate(['/CustomerCarePage'], { queryParams: { list: 'true', refresh: 'true' } });
              this.myTicketsList(); // Refresh ticket details after reopen

              // this.router.navigate(['/CustomerCarePage']);
            } else if (resp.responseCode === 440 || resp.responseCode === 440) {
              this.showCustomAlert('Session expired. Please login again.');
            } else {
              this.showCustomAlert(resp.status);
            }
          } catch (error) {
            await loader.dismiss();
            this.showCustomAlert('Something went wrong! Please try again.');
          }
        }
      }
    ]
  });

  await alert.present();
}

async ticketClose() {
  if (!this.isTicketValid()) {
    this.showCustomAlert('Ticket information is missing or invalid.');
    return;
  }

  const alert = await this.alertCtrl.create({
    header: 'SUMADHURA',
    message: 'Do you want to close the ticket?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Close',
        handler: async () => {
          const loader = await this.loadingalert.create({ message: 'Closing ticket...' });
          await loader.present();

          try {
            const url = this.common.commonservice + "customerTicket/closeTicket.spring"; // Use your base URL
            const body = {
              ticketId: String(this.details.ticketId),
              sessionKey: localStorage.getItem('sessionkey') ,
              deviceToken: localStorage.getItem('deviceTokenId') ,
              requestUrl: 'closeTicket.spring'
            };

            // POST using CapacitorHttp
            const response = await CapacitorHttp.post({
              url,
              headers: { 'Content-Type': 'application/json' },
              data: body
            });

            await loader.dismiss();
            const resp = response.data;

            if (!resp) {
              this.loadingalert.create({ message: 'Invalid server response.' });
              return;
            }

            if (resp.responseCode === 200) {
              this.showCustomAlert(resp.status);
              this.router.navigate(['/ratings'], {
                queryParams: {
                  ticketId: this.details.ticketId,
                  ticketType: this.present_title,
                  complaint_Status: this.complaint_Status,
                  assignedEmp: this.assignedVal
                }
              });
              this.myTicketsList(); // Refresh ticket details after close
              // this.router.navigate(['/ratings']);
            } else if (resp.responseCode === 440 || resp.responseCode === 440) {
              this.showCustomAlert('Session expired. Please login again.');
              // add session handling if needed
            } else {
              this.showCustomAlert(resp.status);
            }
          } catch (error) {
            await loader.dismiss();
            this.showCustomAlert('Something went wrong! Please try again.');
          }
        }
      }
    ]
  });

  await alert.present();
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
        console.log(resp);

          this.image_controller_upload = [];

    } // <-- Add this closing brace for the previous if block

    else if (resp.responseCode === 440) {
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

  // Adjust textarea height dynamically
async adjustTextareaHeight(event: any) {
    const textarea = await event.target.getInputElement();
    
    // Reset height to calculate scroll height accurately
    textarea.style.height = this.minHeight + 'px';
    
    // Calculate lines and new height
    const scrollHeight = textarea.scrollHeight;
    let newHeight = Math.max(scrollHeight, this.minHeight);
    
    // Limit to maximum height (5 lines)
    if (newHeight > this.maxHeight) {
      newHeight = this.maxHeight;
      textarea.style.overflowY = 'auto'; // Show scrollbar after 5 lines
    } else {
      textarea.style.overflowY = 'hidden'; // Hide scrollbar for 1-5 lines
    }
    
    // Apply the calculated height
    textarea.style.height = newHeight + 'px';
  }

  // Handle keydown events
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.chatSubmit();
    }
  }

  // Send message
  sendMessage() {
    if (this.tictcomplint.trim().length > 0) {
      this.messages.push({
        text: this.tictcomplint.trim(),
        timestamp: new Date(),
        type: 'sent'
      });

      this.tictcomplint = '';
      // this.resetTextareaHeight();
    }
  }

  // Reset textarea to single line after sending
  private async resetTextareaHeight() {
    setTimeout(async () => {
      if (this.messageInput) {
        const textarea = await this.messageInput.nativeElement.getInputElement();
        textarea.style.height = this.minHeight + 'px';
        textarea.style.overflowY = 'hidden';
      }
    }, 50);
  }

  
 async chat_attachement(event: any) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Select Attachment',
    buttons: [
      {
        text: 'Photo Library',
        icon: 'images',
        handler: () => event.click()
      },
      {
        text: 'Camera',
        icon: 'camera',
        handler: () => this.selectImage('camera')
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }
    ]
  });
  await actionSheet.present();
}

  
  
}

