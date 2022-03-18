import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { map, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const ROOT = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number = this.getMaxId();

  constructor(private http: HttpClient) {}
  storeDocuments() {
    try {
      this.documentListChangedEvent.next(this.documents.slice());
    } catch (error) {
      console.log(error);
    }
  }
  addDocument(document: Document) {
    if (!document) {
      return;
    }
    this.maxDocumentId++;
    console.log('maxDocumentId', this.maxDocumentId);
    document.id = this.maxDocumentId.toString();
    this.http
      .post<{ message: string; document: Document }>(
        `${ROOT}/documents`,
        document
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
      });
    this.storeDocuments();
  }
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!newDocument || !originalDocument) {
      return;
    }
    const documents = this.getDocuments();
    const pos = this.documents.findIndex((x) => x.id == originalDocument.id);

    if (pos < 0) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    newDocument.id = originalDocument.id;
    this.http
      .put(`${ROOT}/documents/${originalDocument.id}`, newDocument, { headers })
      .subscribe((response) => {
        documents[pos] = newDocument;
        this.documents = documents;
        this.storeDocuments();
      });
  }

  getMaxId(): number {
    return Math.max(...this.documents.map((x) => Number(x.id)));
  }
  getDocuments(): Document[] {
    try {
      this.http.get(`${ROOT}/documents`).subscribe((documents: Document[]) => {
        this.documentListChangedEvent.next(
          documents.sort((a, b) => (a.name > b.name ? -1 : 0))
        );
      });
      return this.documents.slice();
    } catch (error: any) {
      console.log(error);
    }
  }
  getDocument(id: string): Document {
    return this.documents.find((x) => x.id == id);
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((x) => x.id == document.id);
    if (pos < 0) {
      console.log(pos);
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .delete(`${ROOT}/documents/${document.id}`, { headers })
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.storeDocuments();
      });
  }
}
