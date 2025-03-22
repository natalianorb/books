import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl} from '@angular/forms';
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

import { Book, BookDTO, BookFilter } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { Genre } from '../../models/genre.model';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { CreateBookComponent } from '../create-book/create-book.component';
import { debounceTime } from 'rxjs';
import { GenresService } from '../../services/genres.service';
import { BookDetailsComponent } from '../book-details/book-details.component';

interface BookFilterForm {
  search: FormControl<string>;
  authorsIds: FormControl<string[]>;
  pages: FormControl<number[]>;
  genre: FormControl<Genre | undefined>;
}


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
    BookDetailsComponent,
  ],
  providers: [MessageService],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  filterForm = new FormGroup<BookFilterForm>({
    search: new FormControl('', { nonNullable: true }),
    authorsIds: new FormControl([] as string[], { nonNullable: true }),
    pages: new FormControl([0, 1000], { nonNullable: true }),
    genre: new FormControl(undefined, { nonNullable: true }),
  });
  selectedBook: Book | null = null;
  displayDialog = false;
  loading = false;
  pageSize = 20;

  constructor(
    private genresService: GenresService,
    private bookService: BookService,
    private authorService: AuthorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
    this.setupGenres();
    this.findBooks();

    this.filterForm.valueChanges.pipe(debounceTime(1500)).subscribe(() => {
      this.findBooks();
    });
  }

  saveBook(book: Book): void {
    const bookDto: BookDTO = {
      ...book,
      author_id: book.author.id,
    };
    this.bookService.createBook(bookDto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Book saved successfully',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save book',
        });
        console.error('Error saving book', error);
      },
      complete: () => {
        this.hideBookDialog();
        this.findBooks();
      },
    });
  }

  loadAuthors(): void {
    this.authorService.loadAuthors().subscribe({
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

  findBooks(): void {
    this.loading = true;
    const formValues = this.filterForm.value;

    const filter: BookFilter = {
      search: formValues.search,
      authorsIds: formValues.authorsIds,
      minPages: formValues.pages?.[0] ?? 0,
      maxPages: formValues.pages?.[1] ?? 0,
      genre: formValues.genre,
    };

    this.bookService.loadBooks(filter).subscribe({
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
      authorsIds: [],
      pages: [0, 1000],
      genre: undefined,
    });
  }
}
