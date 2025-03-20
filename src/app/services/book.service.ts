import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Book {
  id?: number;
  title: string;
  authorId: number;
  description?: string;
  pages?: number;
  language?: string;
  genre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private booksSubject = new BehaviorSubject<Book[]>(this.books);

  constructor() {}

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  addBook(book: Book): void {
    const newId = Date.now();
    const newBook = { ...book, id: newId };
    this.books = [...this.books, newBook];
    this.booksSubject.next(this.books);
  }

  updateBook(book: Book): void {
    if (book.id) {
      this.books = this.books.map(b => b.id === book.id ? book : b);
      this.booksSubject.next(this.books);
    }
  }

  deleteBook(id: number): void {
    this.books = this.books.filter(book => book.id !== id);
    this.booksSubject.next(this.books);
  }
}
