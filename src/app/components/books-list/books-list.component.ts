import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

import { Book, BookFilter } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { Genre } from '../../models/genre.model';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { CreateBookComponent } from '../create-book/create-book.component';
import { debounceTime } from 'rxjs';
import { GenresService } from '../../services/genres.service';
import { BookDetailsComponent } from "../book-details/book-details.component";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    SliderModule,
    CardModule,
    ToastModule,
    RouterLink,
    CreateBookComponent,
    BookDetailsComponent
],
  providers: [MessageService],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  filterForm: FormGroup;
  selectedBook: Book | null = null;
  displayDialog = false;
  loading = false;
  pageSize = 20;

  constructor(
    private genresService: GenresService,
    private bookService: BookService,
    private authorService: AuthorService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      authorsIds: [[]],
      pages: [[0, 1000]],
      genre: [''],
    });
  }

  ngOnInit(): void {
    this.loadAuthors();
    this.setupGenres();
    this.loadBooks();

    this.filterForm.valueChanges.pipe(debounceTime(1800)).subscribe(() => {
      this.loadBooks();
    });
  }

  saveBook(book: Book): void {
    this.bookService.saveBook(book).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Book saved successfully',
        });
        this.loadBooks();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save book',
        });
        console.error('Error saving book', error);
      },
      complete: () => this.hideBookDialog(),
    });
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load authors',
        });
        console.error('Error loading authors', error);
      },
    });
  }

  setupGenres(): void {
    this.genresService
      .getGenres()
      .subscribe((genres) => (this.genres = genres));
  }

  loadBooks(): void {
    this.loading = true;
    const formValues = this.filterForm.value;

    const filter: BookFilter = {
      search: formValues.search,
      authorsIds: formValues.authorsIds,
      minPages: formValues.pages[0],
      maxPages: formValues.pages[1],
      genre: formValues.genre,
    };

    this.bookService.getBooks(filter).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load books',
        });
        console.error('Error loading books', error);
        this.loading = false;
      },
    });
  }

  openBookDialog(book: Book | null): void {
    this.selectedBook = book;
    this.displayDialog = true;
  }

  hideBookDialog(): void {
    this.selectedBook = null;
    this.displayDialog = false;
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      authors: [],
      pages: [0, 1000],
      genre: '',
    });
  }
}
