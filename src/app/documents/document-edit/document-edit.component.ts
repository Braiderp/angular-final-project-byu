import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(f: NgForm) {
    const { name, description, url } = f.value;
    const document = new Document(null, null, name, description, url, []);
    if (this.editMode) {
      console.log('true');
      this.documentService.updateDocument(this.originalDocument, document);
    } else {
      this.documentService.addDocument(document);
    }
    this.router.navigate(['/documents']);
  }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const { id } = params;
      if (!id) {
        this.editMode = false;
        return;
      } else {
        this.editMode = true;
      }
      this.originalDocument = this.documentService.getDocument(id);
      if (!this.originalDocument) {
        this.editMode = true;
        return;
      }
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}
