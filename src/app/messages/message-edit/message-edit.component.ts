import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  currentSender = '1';
  @ViewChild('subject') subjectER: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  onClear() {
    this.subjectER.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
  onSendMessage() {
    const message = this.msgText.nativeElement.value;
    const subject = this.subjectER.nativeElement.value;
    const msg = new Message(
      (this.messageService.messages.length + 1).toString(),
      subject,
      message,
      this.currentSender
    );
    this.messageService.addMessage(msg);
  }
}
