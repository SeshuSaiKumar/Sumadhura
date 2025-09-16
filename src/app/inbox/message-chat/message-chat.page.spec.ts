import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageChatPage } from './message-chat.page';

describe('MessageChatPage', () => {
  let component: MessageChatPage;
  let fixture: ComponentFixture<MessageChatPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MessageChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
