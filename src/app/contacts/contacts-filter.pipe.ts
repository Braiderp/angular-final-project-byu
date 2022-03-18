import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): any {
    const filteredContacts =
      contacts.filter((x) =>
        x.name.toLowerCase().includes(term.toLowerCase())
      ) || [];
    return filteredContacts;
  }
}
