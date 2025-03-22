import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { CreateAuthorComponent } from '../create-author/create-author.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CreateAuthorComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];
  selectedAuthor: Author | null = null;
  displayDialog = false;
  loading = false;

  constructor(
    private authorService: AuthorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.onAuthorsChange();
  }

  onAuthorsChange() {
    this.authorService.loadAuthors().subscribe((authors) => {
      this.authors = authors;
    });
  }

  openAuthorCreation(): void {
    this.selectedAuthor = null;
    this.displayDialog = true;
  }

  openAuthorEdit(author: Author): void {
    this.selectedAuthor = { ...author };
    this.displayDialog = true;
  }

  deleteAuthor(author: Author): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${author.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.onAcceptDeleteAuthor(author),
    });
  }

  onAcceptDeleteAuthor(author: Author): void {
    if (author.id) {
      this.loading = true;
      this.authorService
        .deleteAuthor(author.id)
        .pipe(tap(() => this.onAuthorsChange()))
        .subscribe({
          next: (authors) => {
            this.authors = authors;
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Author Deleted',
            });
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Author not deleted',
            });
          },
        });
    }
  }

  hideAuthorCreation(): void {
    this.displayDialog = false;
  }
}
