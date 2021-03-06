import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';

import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  nativeWindow: any;

  constructor(
    private windowRefService: WindRefService,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windowRefService.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      const { id } = params;
      this.document = this.documentService.getDocument(id);
      if (!this.document || !id) {
        this.router.navigate(['/documents']);
      }
    });
  }
  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents'], { relativeTo: this.route });
  }
}
