import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  error: string = this.contactService.getError();

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  onSubmit(f: NgForm) {
    const { name, email, phone, imageUrl } = f.value;
    const contact = new Contact(
      null,
      name,
      email,
      phone,
      imageUrl,
      this.groupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, contact);
    } else {
      this.contactService.addContact(contact);
    }
    this.router.navigate(['/contacts']);
  }
  drop(event: CdkDragDrop<Contact>) {
    this.contactService.error = null;
    this.error = null;
    const contacts = this.contactService.getContacts();
    const exists = this.groupContacts.find(
      (x) => Number(x.id) === Number(contacts[event?.previousIndex]?.id)
    );
    const isCurrent =
      this.editMode && contacts[event.previousIndex].id == this.contact.id;
    if (isCurrent) {
      this.contactService.error =
        'You cannot add the currently selected contact to the group';
      this.error = this.contactService.getError();
    }
    if (exists) {
      this.contactService.error = 'That item is already in the group list.';
      this.error = this.contactService.getError();
    }
    if (this.error) {
      setTimeout(() => {
        this.contactService.error = null;
        this.error = null;
      }, 3000);
      return;
    }
    copyArrayItem(
      this.contactService.getContacts(),
      this.groupContacts,
      event.previousIndex,
      event.currentIndex
    );
  }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const { id } = params;
      this.id = id;
      console.log('id', this.id);
      if (!this.id) {
        this.editMode = false;
        return;
      } else {
        this.editMode = true;
      }
      this.originalContact = this.contactService.getContact(id);
      if (!this.originalContact) {
        this.editMode = true;
        return;
      }
      console.log('editMode', this.editMode);
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact.group?.length) {
        this.groupContacts = this.contact.group;
      }
      console.log('editContact', this.contact);
    });
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
  onCancel() {
    this.router.navigate(['/contacts']);
  }
}
