import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-author',
  standalone: true,
  imports: [
    CalendarModule,
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
  ],
  templateUrl: './create-author.component.html',
  styleUrls: ['./create-author.component.scss'],
})
export class CreateAuthorComponent implements OnChanges {
  @Input() author: Author | null = null;
  @Output() saved = new EventEmitter<Author>();
  @Output() close = new EventEmitter<void>();

  loading = false;
  authorForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
  });
  isEditMode = false;

  constructor(
    private authorService: AuthorService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {
    if (this.author) {
      this.isEditMode = true;
      this.authorForm.patchValue(this.author);
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      this.loading = true;

      if (this.author && this.author.id) {
        const author = this.authorForm.value;
        this.authorService.updateAuthor(author).subscribe({
          next: () => {
            this.onSuccess();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Author Updated',
            });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Author Update Failed',
            });
          },
        });
      } else {
        const author = {
          name: this.authorForm.value.name,
        };
        this.authorService.createAuthor(author).subscribe({
          next: () => {
            this.onSuccess();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Author Created',
            });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Author Creation Failed',
            });
          },
        });
      }
    }
  }

  onSuccess() {
    this.loading = false;
    this.authorForm.reset();
    this.saved.emit();
    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }
}
