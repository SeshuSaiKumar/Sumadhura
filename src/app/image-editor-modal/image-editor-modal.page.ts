import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

interface Point { x: number; y: number; }

@Component({
  selector: 'app-image-editor-modal',
  templateUrl: './image-editor-modal.page.html',
  styleUrls: ['./image-editor-modal.page.scss'],
})
export class ImageEditorModalPage implements OnInit, AfterViewInit {
  @ViewChild('canvasEl', { static: false }) canvasEl!: ElementRef<HTMLCanvasElement>;
  originalImages: { base64: string; name: string; shouldAddTimestamp: boolean }[] = [];

  @Input() images: { base64: string; name: string; shouldAddTimestamp: boolean }[] = [];
  @Input() currentIndex: number = 0;

  editedImages: { base64: string; name: string; shouldAddTimestamp: boolean }[] = [];

  imageBase64: string = '';
  imageName: string = '';
  shouldAddTimestamp: boolean = true;

  isDrawing = false;
  drawingEnabled = false;

  // store each image’s paths separately
  drawingPathsPerImage: { [index: number]: Point[][] } = {};  // ← NEW

  currentPath: Point[] = [];
  drawingPaths: Point[][] = [];                                // ← will be reloaded per-image

  lastX = 0;
  lastY = 0;

  ctx!: CanvasRenderingContext2D;
  image!: HTMLImageElement;
    timestampApplied: { [index: number]: boolean } = {};

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {
    this.images = this.navParams.get('images') || [];
    this.currentIndex = this.navParams.get('currentIndex') || 0;
    this.originalImages = this.images.map(img => ({ ...img, base64: img.base64 }));

    this.editedImages = [...this.images];
  }

  ngOnInit() {
    this.loadCurrentImage();
  }

  ngAfterViewInit() {
    this.loadCanvasImage();
  }
  loadCurrentImage() {
    // ← load from ORIGINALS (not from editedImages)  
    const img = this.originalImages[this.currentIndex];
    if (!img) return;

    this.imageBase64        = img.base64;
    this.imageName          = img.name;
    this.shouldAddTimestamp = img.shouldAddTimestamp;

    this.drawingPaths = this.drawingPathsPerImage[this.currentIndex] || [];
    this.loadCanvasImage();
  }


 // ← mark async so we can await the save
 async insertNewImage(image: { base64: string; name: string; shouldAddTimestamp: boolean }) {
   // 1) first bake in any timestamp or strokes on the current image
   await this.saveCurrentImageTemporarily();

   // 2) then splice in the new (gallery) image
   const insertAt = this.currentIndex + 1;
   this.editedImages.splice(insertAt, 0, image);
   this.drawingPathsPerImage[insertAt] = [];

   // 3) move over and load the fresh gallery frame
   this.currentIndex = insertAt;
   this.drawingPaths   = [];
   this.loadCurrentImage();
 }

    loadCanvasImage() {
    const canvas = this.canvasEl.nativeElement;
    const ctx    = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx   = ctx;
    this.image = new Image();
    this.image.onload = () => {
      // draw the raw image
      canvas.width  = window.innerWidth;
      canvas.height = canvas.width * (this.image.height / this.image.width);
      ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

      // overlay timestamp every time if flagged
      if (this.shouldAddTimestamp) {
        this.drawOverlayText(ctx, canvas.width, canvas.height);
      }

      // draw any strokes
      this.redrawAll();
    };
    // use ORIGINAL base64
    this.image.src = this.imageBase64;
  }


  // … rest of your class unchanged …



  async saveCurrentImageTemporarily() {
    const canvas    = this.canvasEl.nativeElement;
    const tempCanvas = document.createElement('canvas');
    const ctx       = tempCanvas.getContext('2d')!;
    tempCanvas.width  = canvas.width;
    tempCanvas.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    let finalBase64: string;
    if (this.shouldAddTimestamp) {
      finalBase64 = await this.addTextToImage(tempCanvas);
    } else {
      finalBase64 = tempCanvas.toDataURL('image/jpeg', 0.95);
    }

    this.editedImages[this.currentIndex] = {
      base64: finalBase64,
      name: this.imageName,
      shouldAddTimestamp: this.shouldAddTimestamp
    };
    console.log('Saving image at index', this.currentIndex, 'Timestamp?', this.shouldAddTimestamp);

    // persist this image's drawing paths
    this.drawingPathsPerImage[this.currentIndex] = [...this.drawingPaths];     // ← CHANGED
  }

 async nextImage() {
   if (this.currentIndex < this.editedImages.length - 1) {
     this.drawingPathsPerImage[this.currentIndex] = [...this.drawingPaths];
     this.currentIndex++;
     this.loadCurrentImage();   
     
     // now load the next one
   }
 }
 async prevImage() {
   if (this.currentIndex > 0) {
   this.drawingPathsPerImage[this.currentIndex] = [...this.drawingPaths];
     this.currentIndex--;
     this.loadCurrentImage();
   }
 }
    // ← FINALLY, when user clicks “✔” to SAVE everything:
  async saveDrawing() {
    // draw one last time onto a temp canvas
    const canvas    = this.canvasEl.nativeElement;
    const tempCanvas = document.createElement('canvas');
    const ctx       = tempCanvas.getContext('2d')!;
    tempCanvas.width  = canvas.width;
    tempCanvas.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    // overlay timestamp if needed
    if (this.shouldAddTimestamp) {
      this.drawOverlayText(ctx, tempCanvas.width, tempCanvas.height);
    }
    // re‑draw strokes
    this.ctx = ctx;  // temporarily use same context logic
    this.redrawAll();

    // export final image
    const finalBase64 = tempCanvas.toDataURL('image/jpeg', 0.95);

    // commit it into editedImages
    this.editedImages[this.currentIndex] = {
      base64: finalBase64,
      name: this.imageName,
      shouldAddTimestamp: this.shouldAddTimestamp
    };

    // then close
    this.modalCtrl.dismiss({ editedImages: this.editedImages });
  }


  clearCanvas() {
    const canvas = this.canvasEl.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    if (this.shouldAddTimestamp) {
      this.drawOverlayText(this.ctx, canvas.width, canvas.height);
    }
    this.redrawAll();
  }

 undoDrawing() {
  if (this.isDrawing) this.stopDrawing();

  if (this.drawingPaths.length > 0) {
    this.drawingPaths.pop();                                               // remove last stroke
    this.drawingPathsPerImage[this.currentIndex] = [...this.drawingPaths];  // keep in memory
    this.clearCanvas();                                                     // redraw (image + timestamp + remaining strokes)
  }
}



  redrawAll() {
    const canvas = this.canvasEl.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

    if (this.shouldAddTimestamp) {
      this.drawOverlayText(this.ctx, canvas.width, canvas.height);
    }

    this.ctx.strokeStyle = '#007bff';
    this.ctx.lineWidth   = 3;

    for (const path of this.drawingPaths) {
      this.ctx.beginPath();
      for (let i = 0; i < path.length - 1; i++) {
        this.ctx.moveTo(path[i].x, path[i].y);
        this.ctx.lineTo(path[i + 1].x, path[i + 1].y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawOverlayText(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const padding  = 10;
    const fontSize = Math.floor(width * 0.05);
    ctx.font         = `${fontSize}px Verdana`;
    ctx.fillStyle    = 'white';
    ctx.strokeStyle  = 'black';
    ctx.lineWidth    = 4;
    ctx.textBaseline = 'bottom';

    const now     = new Date();
    const day     = now.getDate();
    const month   = now.toLocaleString('default', { month: 'short' });
    const year    = now.getFullYear();
    const hours   = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm    = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const timestampText = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;

    ctx.strokeText('Priority Pulse', padding, height - fontSize - 21);
    ctx.fillText  ('Priority Pulse', padding, height - fontSize - 21);
    ctx.strokeText(timestampText, padding, height - 10);
    ctx.fillText  (timestampText, padding, height - 10);
  }

  enableDrawingMode() {
    this.drawingEnabled = !this.drawingEnabled;
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    if (!this.drawingEnabled) return;
    this.isDrawing   = true;
    this.currentPath = [];
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    const x    = this.getPointerX(event, rect);
    const y    = this.getPointerY(event, rect);
    this.currentPath.push({ x, y });
    this.lastX = x;
    this.lastY = y;
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.drawingEnabled) return;
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    const x    = this.getPointerX(event, rect);
    const y    = this.getPointerY(event, rect);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();

    this.lastX = x;
    this.lastY = y;
    this.currentPath.push({ x, y });
  }

  stopDrawing() {
    if (!this.drawingEnabled) return;
    this.isDrawing = false;
    if (this.currentPath.length > 0) {
      this.drawingPaths.push([...this.currentPath]);
    }
  }

  getPointerX(event: any, rect: DOMRect) {
    const rawX = event.touches ? event.touches[0].clientX : event.clientX;
    return (rawX - rect.left) * (this.canvasEl.nativeElement.width / rect.width);
  }

  getPointerY(event: any, rect: DOMRect) {
    const rawY = event.touches ? event.touches[0].clientY : event.clientY;
    return (rawY - rect.top)  * (this.canvasEl.nativeElement.height / rect.height);
  }

  private async addTextToImage(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement('canvas');
      const ctx        = tempCanvas.getContext('2d')!;
      tempCanvas.width  = canvas.width;
      tempCanvas.height = canvas.height;
      ctx.drawImage(canvas, 0, 0);
      if (this.shouldAddTimestamp) {
        this.drawOverlayText(ctx, tempCanvas.width, tempCanvas.height);
      }
      resolve(tempCanvas.toDataURL('image/jpeg', 1.0));
    });
  }

  async closeModal() {
  // 1) bake in timestamp & strokes for the currently visible image
  await this.saveCurrentImageTemporarily();
  // 2) dismiss and hand back the fully‑up‑to‑date editedImages array
  this.modalCtrl.dismiss({ editedImages: this.editedImages });
}
}
