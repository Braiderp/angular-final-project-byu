import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
const ROOT = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number = this.getMaxId();
  constructor(private http: HttpClient) {}
  storeMessages() {
    try {
      this.messageChangedEvent.next(this.messages.slice());
    } catch (error) {
      console.log(error);
    }
  }
  getMessages(): Message[] {
    try {
      this.http.get(`${ROOT}/messages`).subscribe((messages: Message[]) => {
        this.messages = messages;
        this.storeMessages();
      });
      return this.messages.slice();
    } catch (error: any) {
      console.log(error);
    }
  }

  getMessage(id: string): Message {
    return this.getMessages().find((x) => x.id == id);
  }
  getMaxId(): number {
    return Math.max(...this.messages.map((x) => Number(x.id)));
  }
  addMessage(message: Message) {
    if (!message) {
      return;
    }
    this.maxMessageId++;
    console.log('maxId', this.maxMessageId);
    message.id = this.maxMessageId.toString();
    this.http
      .post<{ message: string; document: Message }>(`${ROOT}/messages`, message)
      .subscribe((responseData) => {
        this.messages.push(responseData.document);
      });
    this.storeMessages();
  }
}
