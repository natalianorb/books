import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { Book, BookService } from '../../services/book.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
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
  bookForm!: FormGroup;
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
    private fb: FormBuilder,
    private authorService: AuthorService,
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAuthors();
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      authorsIds: [[], Validators.required],
      description: [''],
      pages: [0, [Validators.min(1)]],
      language: ['Russian', Validators.required],
      genre: [''],
    });
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const book: Book = this.bookForm.value;
      this.bookService.addBook(book);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Book "${book.title}" has been created successfully`,
        life: 3000,
      });

      this.bookForm.reset({
        language: 'Russian',
      });
    }
  }
}
