import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Author } from '../../models/author.model';

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
export class CreateAuthorComponent implements OnInit {
  @Input() author: Author | null = null;
  @Output() save = new EventEmitter<Author>();
  @Output() cancel = new EventEmitter<void>();

  authorForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    if (this.author) {
      this.isEditMode = true;
      this.authorForm.patchValue(this.author);
    }
  }

  initForm(): void {
    this.authorForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      birthDate: [''],
      biography: ['']
    });
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      this.save.emit(this.authorForm.value);
      this.authorForm.reset();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
