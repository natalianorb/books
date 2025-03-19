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
    CreateAuthorComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];
  selectedAuthor: Author | null = null;
  displayDialog = false;

  constructor(
    private authorService: AuthorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
    });
  }

  openNew(): void {
    this.selectedAuthor = null;
    this.displayDialog = true;
  }

  editAuthor(author: Author): void {
    this.selectedAuthor = { ...author };
    this.displayDialog = true;
  }

  deleteAuthor(author: Author): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${author.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (author.id) {
          this.authorService.deleteAuthor(author.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Author Deleted',
            life: 3000
          });
        }
      }
    });
  }

  saveAuthor(author: Author): void {
    if (author.id) {
      this.authorService.updateAuthor(author);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Author Updated',
        life: 3000
      });
    } else {
      this.authorService.addAuthor(author);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Author Created',
        life: 3000
      });
    }
    this.displayDialog = false;
  }

  hideDialog(): void {
    this.displayDialog = false;
  }
}
