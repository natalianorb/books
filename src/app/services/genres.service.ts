import { Injectable } from '@angular/core';
import { Genre } from '../models/genre.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private genres: Genre[] = [
    { name: 'Fiction', code: 'fiction' },
    { name: 'Non-Fiction', code: 'non-fiction' },
    { name: 'Science Fiction', code: 'sci-fi' },
    { name: 'Fantasy', code: 'fantasy' },
    { name: 'Mystery', code: 'mystery' },
    { name: 'Romance', code: 'romance' },
    { name: 'Thriller', code: 'thriller' },
    { name: 'Biography', code: 'biography' },
  ];
  private genresSubject = new BehaviorSubject<Genre[]>(this.genres);

  getGenres() {
    // In a real app, you might fetch this from an API
    return this.genresSubject.asObservable();
  }
}
