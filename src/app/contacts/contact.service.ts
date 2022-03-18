import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
const ROOT = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnInit {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;
  error: string;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
  storeContacts() {
    try {
      this.contactListChangedEvent.next(this.contacts.slice());
    } catch (error) {
      console.log(error);
    }
  }
  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
    this.maxContactId++;
    contact.id = this.maxContactId.toString();
    this.http
      .post<{ message: string; contact: Contact }>(`${ROOT}/contacts`, contact)
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.storeContacts();
      });
  }
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!newContact || !originalContact) {
      return;
    }
    const pos = this.contacts.findIndex((x) => x.id == originalContact.id);

    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(`${ROOT}/contacts/${originalContact.id}`, newContact, {
        headers,
      })
      .subscribe(() => {
        const contacts = this.contacts.slice();
        contacts[pos] = newContact;
        this.contacts = contacts;
        this.storeContacts();
      });
  }
  getError(): string {
    return this.error;
  }
  getMaxId(): number {
    return Math.max(...this.contacts.map((x) => Number(x.id)));
  }
  getContacts(): Contact[] {
    try {
      this.http.get(`${ROOT}/contacts`).subscribe((contacts: Contact[]) => {
        this.contactListChangedEvent.next(
          contacts.sort((a, b) => (a.name > b.name ? -1 : 0))
        );
      });
      return this.contacts.slice();
    } catch (error: any) {
      console.log(error);
    }
  }
  getContact(id: string): Contact {
    return this.contacts.find((x) => x.id == id);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex((x) => x.id == contact.id);
    if (pos < 0) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .delete(`${ROOT}/contacts/${contact.id}`, { headers })
      .subscribe(() => {
        this.contacts.splice(pos, 1);
        this.storeContacts();
      });
  }
}
