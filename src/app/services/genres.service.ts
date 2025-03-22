import { Injectable } from '@angular/core';
import { Genre } from '../models/genre.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private genres: Genre[] = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
  ];
  private genresSubject = new BehaviorSubject<Genre[]>(this.genres);

  getGenres() {
    // In a real app, you might fetch this from an API
    return this.genresSubject.asObservable();
  }
}
