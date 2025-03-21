import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, DividerModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent {
  @Input() book!: Book;

  getGenreSeverity(genre: string): string {
    const genreSeverityMap: { [key: string]: string } = {
      Fantasy: 'info',
      'Science Fiction': 'warning',
      Mystery: 'danger',
      Romance: 'success',
      Classic: 'secondary',
      // todo Add more genres as needed
    };

    return genreSeverityMap[genre] || 'info';
  }
}
