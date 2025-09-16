import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MessageChatPageRoutingModule } from './message-chat-routing.module';
import { MessageChatPage } from './message-chat.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageChatPageRoutingModule,
    ComponentsModule,
    FileUploadModule,
  ],
  declarations: [MessageChatPage]
})
export class MessageChatPageModule {}
