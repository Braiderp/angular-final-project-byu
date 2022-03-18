import { Component, OnInit, Input } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css'],
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  // messageSender: string;
  subject: string;
  constructor(private contactService: ContactService) {}
  ngOnInit() {
    // const contact: Contact = this.contactService.getContact(
    //   this.message.sender
    // );
    // this.messageSender = contact?.name || 'Unknown';
    this.subject = this.message.subject;
  }
}