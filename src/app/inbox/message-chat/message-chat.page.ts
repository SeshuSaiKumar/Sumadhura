import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, IonRouterOutlet, AlertController, ActionSheetController } from '@ionic/angular';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { CommonService } from 'src/app/common.service';
import { LoaderService } from 'src/app/LoaderService';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.page.html',
  styleUrls: ['./message-chat.page.scss'],
})
export class MessageChatPage implements OnInit {
  controller: any;
  messenger_details: Array<any> = [];
  fileName: string;
  theActualPicture: string | undefined;
  image_controller_upload: Array<any> = [];

  public uploader: FileUploader = new FileUploader({
    url: '',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'txt', 'video', 'doc', 'xls', 'xlsx', 'docx', 'audio', 'ppt', 'pptx']

  });
  controllerdata: any;
  array: Array<any> = [];
  path: string;
  filename: string;
  fileUploadName: string;
  maincontroller: Array<any> = [];
  image: any;
  type_your_message: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private fb: FormBuilder, private actionSheetController: ActionSheetController,
    public loadingController: LoadingController, private loaderService: LoaderService,
    private menu: MenuController,
    private common: CommonService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet) {
    this.route.queryParams.subscribe(params => {
      if (params['item']) {
        const data = JSON.parse(params['item']);
        this.controller = data;
        console.log(this.controller);
        this.getDetails(this.controller.messengerId);
      }
    });


  }

  ngOnInit() {
  }

  getFileIcon(p: any): string {
    const ext = p.docName?.split('.').pop()?.toLowerCase();

    if (!ext) return p.url;

    // Images (show actual thumbnail if available)
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff', 'tif', 'heic'];
    if (imageExts.includes(ext)) {
      return p.docThumbLocaton || p.url;
    }

    // PDF
    if (ext === 'pdf') return 'assets/images/pdficon.png';

    // Word
    if (['doc', 'docx'].includes(ext)) return 'assets/images/wordicon.png';

    // Excel
    if (['xlsx', 'xlsm', 'xlsb', 'xltx', 'xltm', 'xls', 'xlt', 'xml', 'xlam', 'xla', 'xlw', 'xlr'].includes(ext)) {
      return 'assets/images/xlsxicon.png';
    }

    // PowerPoint
    if (['ppt', 'pptx'].includes(ext)) return 'assets/images/pptxicon.png';

    // Text
    if (ext === 'txt') return 'assets/images/txticon.jpg';

    // Video (use an icon instead of img)
    const videoExts = ['mp4', 'avi', 'mov', 'mpg', 'ogg', 'webm', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'wmv', 'qt', 'flv', 'swf', 'avchd'];
    if (videoExts.includes(ext)) return 'video';

    // Default
    return 'assets/images/file1.png';
  }

  myimage(p: any, item: any) {
    console.log(p);
    console.log(item);
    window.open(p.url, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
  }

  //   myimage(fileurl) {
  //   //alert(fileurl)
  //   window.open(fileurl, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
  // }

  async getDetails(messengerId: any) {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.common.presentAlert("No internet connection. Please check your network and try again.");
      return false;
    }
    this.loaderService.showLoader();
    const options = {
      url: this.common.commonservice + "messenger/getChatDetails.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "sessionKey": localStorage.getItem("sessionkey_afterlogin"),
        "messengerId": messengerId,
      },
    };

    console.log("URL:", options.url);
    console.log("Body:", options.data);

    return CapacitorHttp.post(options).then(response => {
      console.log("Response:", response.data);
      this.loaderService.hideLoader();
      if (response.data.responseCode == 200) {
        this.messenger_details = response.data.messengerDetailsPojos;
      } else if (response.data.responseCode == 440) {
        this.common.presentAlert(response.data.status);
        return false;
      } else if (response.data.responseCode == 600 || response.data.responseCode == 700) {
        this.common.presentAlert(response.data.status);
        return false;
      } else {
        this.common.presentAlert("Something went wrong! Please try again.");
        return false;
      }
    }).catch(err => {
      this.loaderService.hideLoader();

      if (err.status === 0) {
        this.common.presentAlert("Unable to connect to server, Something seems to be wrong.");
      } else {
        this.common.presentAlert("Please try again after some time.");
      }

      return false;
    });
  }



  async chat_attachement(event: any) {


    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Upload File',
          handler: () => {
            event.click()

          }
        },
        // {
        //   text: 'Load from Library',
        //   handler: () => {

        //     this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        //   }
        // },
        {
          text: 'Use Camera',
          handler: () => {
            this.selectImage("camera");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();


  }



  async selectImage(userdata: any) {
    if (userdata == "camera") {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        saveToGallery: true,
        source: CameraSource.Camera
      });

      this.theActualPicture = image.dataUrl;
      this.fileName = new Date().getTime() + '.jpeg';

      this.controllerdata = [];


      this.controllerdata.push({
        base64: image.dataUrl,
        name: this.fileName,
      });



    }
  }

  removeItem1(i: any) {
    this.controllerdata.splice(i, 1);

  }

  async onFileSelected(event: any) {
    console.log(event.target.files[0].type);


    if (event.target.files[0].type == "audio/mpeg" || event.target.files[0].type == "audio/mp3" || event.target.files[0].type == "audio/mp4"
      || event.target.files[0].type == "audio/acc" || event.target.files[0].type == "audio/ogg" || event.target.files[0].type == "") {
      this.uploader.queue.splice(-1);
      this.controllerdata.splice(-1);
      this.common.presentAlert(`Sorry for the Inconvenience Audio/Video file format are not supporting at the moment.`);
      return false;
    }

    if (event.target.files[0].type == "video/mp4" || event.target.files[0].type == "video/avi" ||
      event.target.files[0].type == "video/mov" || event.target.files[0].type == "video/mpg" || event.target.files[0].type == "video/ogg"
      || event.target.files[0].type == "video/webm" || event.target.files[0].type == "video/mp2" || event.target.files[0].type == "video/mpeg"
      || event.target.files[0].type == "video/mpe" || event.target.files[0].type == "video/mpv" || event.target.files[0].type == "video/mp4"
      || event.target.files[0].type == "video/m4v" || event.target.files[0].type == "video/wmv" || event.target.files[0].type == "video/qt"
      || event.target.files[0].type == "video/flv" || event.target.files[0].type == "video/swf" || event.target.files[0].type == "video/avchd" || event.target.files[0].type == "") {

      let filesize = 0;
      const file: File = event.target.files[0];
      filesize = Math.round(event.target.files[0].size / 1024 / 1024);



      if (Math.floor(filesize) > Number(20)) {
        this.common.presentAlert(`Your max file size limit is 20 MB, Total file size is exceeded by ${filesize.toFixed(4)}`);
        this.uploader.queue.splice(-1);
        this.controllerdata.splice(-1);
        return false;
      }
      else {

        this.array = [];
        this.path = "";
        this.filename = "";
        this.fileUploadName = "";
        this.controllerdata = [];
        this.maincontroller = [];
        this.controllerdata.splice(-1);

        console.log(this.uploader.queue);

        if (this.uploader.queue.length != 0) {
          for (var i = 0; i < this.uploader.queue.length; i++) {


            this.filename = this.uploader.queue[i].file.rawFile['name'];
            this.getBase64(this.uploader.queue[i].file.rawFile, this.filename).then(
              data => {

                if (data == "") {
                  this.common.presentAlert("Sorry, we could not upload this file. Please try from another source.");
                  return false;
                } else {
                  this.array = [];
                  this.array.push(data);

                }
              }
            );
          }
        } else {
          this.common.presentAlert("Sorry, we could not upload this file. Please try from another source.");
          return false;

        }

        //this.cmn.commonAlertfun(`File size is Less than 20 mb  and current file size is ${filesize.toFixed(4)}`);
      }

      // this.uploader.queue.splice(-1);
      // this.controllerdata.splice(-1);
      // this.common.presentAlert(`Sorry for the Inconvenience Audio/Video file format are not supporting at the moment.`);
      // return false;
    }


    //alert("Can't open file, unsupported audio codec or unsupported audio video file error");
    let filesize = 0;
    const file: File = event.target.files[0];
    filesize = Math.round(event.target.files[0].size / 1024 / 1024);




    if (Math.floor(filesize) > Number(20)) {
      this.common.presentAlert(`Your max file size limit is 20 MB, Total file size is exceeded by ${filesize.toFixed(4)}`);
      this.uploader.queue.splice(-1);
      this.controllerdata.splice(-1);
      return false;
    }
    else {

      this.array = [];
      this.path = "";
      this.filename = "";
      this.fileUploadName = "";
      this.controllerdata = [];
      this.maincontroller = [];
      this.controllerdata.splice(-1);

      console.log(this.uploader.queue);

      if (this.uploader.queue.length != 0) {
        for (var i = 0; i < this.uploader.queue.length; i++) {


          this.filename = this.uploader.queue[i].file.rawFile['name'];



          this.getBase64(this.uploader.queue[i].file.rawFile, this.filename).then(
            data => {

              if (data == "") {
                this.common.presentAlert("Sorry, we could not upload this file. Please try from another source.");
                return false;
              } else {
                this.array = [];
                this.array.push(data);

              }
            }
          );
        }
      } else {
        this.common.presentAlert("Sorry, we could not upload this file. Please try from another source.");
        return false;

      }



      //this.cmn.commonAlertfun(`File size is Less than 20 mb  and current file size is ${filesize.toFixed(4)}`);
    }

  }



  getBase64(file: any, filename: any) {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();
      this.image = "";
      reader.onloadend = (e) => {
        this.image = reader.result;
        this.controllerdata = [];


        this.controllerdata.push({
          base64: this.image,
          name: filename,
        });


        this.uploader.queue = [];
        //  this.mainfun(this.controllerdata);

      }
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  onInputChange(event: any) {

    const value = event.target.value;
    if (value && value.length > 0) {
      // Capitalize the first letter and keep the rest of the value as is
      this.type_your_message = value.charAt(0).toUpperCase() + value.slice(1);
    }


  }



  chat_submit_fun() {

    if (this.maincontroller == undefined) {
      this.maincontroller = [];
    }
    if (this.controllerdata == undefined) {
      this.controllerdata = [];
    }

    if (this.maincontroller.length == 0 && this.controllerdata.length == 0) {
      this.image_controller_upload = [];
    } else if (this.maincontroller == undefined || this.maincontroller.length == 0) {
      this.image_controller_upload = this.controllerdata;
    } else if (this.controllerdata == undefined || this.controllerdata.length == 0) {
      this.image_controller_upload = this.maincontroller;
    }






    if (this.image_controller_upload.length == 0) {
      if (this.type_your_message == undefined || this.type_your_message == "" || this.type_your_message == "undefined") {
        this.common.presentAlert("Please type your message");
        return false;
      }

    }



    if (this.type_your_message == undefined || this.type_your_message == "" || this.type_your_message == "undefined") {
      this.type_your_message = " ";
    }


    var d = new Date();

    var datestring_create = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + '00';




    console.log(this.controller);
  

    //this.loader_hideme = true;
    this.loaderService.showLoader();
    const options = {
      url: this.common.commonservice + "messenger/chatSubmit.spring",
      headers: { 'Content-Type': 'application/json' },
      data: {
        "deviceToken": this.common.deviceToken,
        "sessionKey": localStorage.getItem("sessionkey_afterlogin"),
        "messengerId": this.controller.messengerId,
        "flag": true,
        "siteIds": [this.controller.siteId],
        "deptIds": [this.controller.deptId],
        "subject": this.controller.subject,
        "message": this.type_your_message,
        "sendType": this.controller.sendType,
        "sendTo": this.controller.sendTo,
        "employeeIds": [this.controller.employeeId],
        "files": this.image_controller_upload,


      },
    };

    console.log(options.data);

    //  this.loaderService.showLoader();
    return CapacitorHttp.post(options).then(response => {
      console.log(response.data);
      if (response.data.responseCode == 200) {
        this.loaderService.hideLoader();
        //this.loader_hideme = false;

        this.type_your_message = "";
        this.controllerdata = [];
        this.maincontroller = [];

        this.getDetails(response.data.messengerId);
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

}
