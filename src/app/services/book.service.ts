import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, map, tap } from 'rxjs';
import { Book, BookFilter } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books'; // here should be the link to your backend API
  private books: Book[] = [];
  private booksSubject = new BehaviorSubject<Book[]>(this.books);

  constructor(private http: HttpClient) {}

  getBooks(filter: BookFilter = {}): Observable<Book[]> {
    let params = new HttpParams();

    if (filter.search) {
      params = params.set('query', filter.search);
      params = params.set('description', filter.search);
    }

    if (filter.authorsIds && filter.authorsIds.length > 0) {
      params = params.append('authorsIds', filter.authorsIds.toString());
    }

    if (filter.minPages) {
      params = params.set('minPages', filter.minPages.toString());
    }

    if (filter.maxPages) {
      params = params.set('maxPages', filter.maxPages.toString());
    }

    if (filter.genre) {
      params = params.set('genre', filter.genre);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  saveBook(book: Book): Observable<Book> {
    return timer(300).pipe(
      // imitation of http request
      map(() => {
        const newId = Date.now(); // new id should be generated at backend
        const newBook = { ...book, id: newId };
        return newBook;
      }),
      tap((newBook) => this.addBook(newBook)) // redundant code if we use real http request
    );
  }

  addBook(book: Book): void {
    const books = [...this.books, book];
    this.updateLocalBooks(books);
  }

  deleteBook(id: number): void {
    const filtered = this.books.filter((book) => book.id !== id);
    this.updateLocalBooks(filtered);
  }

  updateLocalBooks(books: Book[]) {
    this.books = books;
    this.booksSubject.next(this.books);
  }
}
