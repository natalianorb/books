import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  /* this is a mock of the real service */
  private authors: Author[] = [
    { id: 1, name: 'Rowling' },
    { id: 2, name: 'George Martin' },
  ];

  private authorsSubject = new BehaviorSubject<Author[]>(this.authors);

  constructor() {}

  getAuthors(): Observable<Author[]> {
    return this.authorsSubject.asObservable();
  }

  addAuthor(author: Author): void {
    const newId = Date.now();
    const newAuthor = { ...author, id: newId };
    this.authors = [...this.authors, newAuthor];
    this.authorsSubject.next(this.authors);
  }

  updateAuthor(updatedAuthor: Author): void {
    if (updatedAuthor.id) {
      this.authors = this.authors.map(author => author.id === updatedAuthor.id ? updatedAuthor : author);
      this.authorsSubject.next(this.authors);
    }
  }

  deleteAuthor(id: number): void {
    this.authors = this.authors.filter(author => author.id !== id);
    this.authorsSubject.next(this.authors);
  }
}
