import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { Book } from '../../models/book.model';
import { GenresService } from '../../services/genres.service';
import { Genre } from '../../models/genre.model';

interface BookForm {
  title: FormControl<string>;
  author: FormControl<Author | null>;
  description: FormControl<string>;
  pages: FormControl<number>;
  language: FormControl<string>;
  genre: FormControl<Genre | null>;
}

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    MultiSelectModule,
  ],
  providers: [MessageService],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss'],
})
export class CreateBookComponent implements OnInit {
  @Output() save = new EventEmitter<Book>();
  bookForm!: FormGroup;
  genres: Genre[] = [];
  authors: Author[] = [];
  languages: string[] = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Chinese',
    'Arabic',
    'Hindi',
    'Bengali',
    'Korean',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Greek',
    'Turkish',
  ];

  constructor(
    private authorService: AuthorService,
    private genresService: GenresService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAuthors();
    this.setupGenres();
  }

  initForm(): void {
    this.bookForm = new FormGroup<BookForm>({
      title: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      author: new FormControl(null, Validators.required),
      description: new FormControl('', {
        nonNullable: true,
      }),
      pages: new FormControl(0, {
        nonNullable: true,
        validators: Validators.min(1),
      }),
      language: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      genre: new FormControl(null, Validators.required),
    });
  }
  setupGenres(): void {
    this.genresService
      .getGenres()
      .subscribe((genres) => (this.genres = genres));
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.save.emit(this.bookForm.value);

      this.bookForm.reset();
    }
  }
}
