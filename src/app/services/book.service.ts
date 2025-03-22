import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, map, tap } from 'rxjs';
import { Book, BookFilter } from '../models/book.model';
import { Genre } from '../models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
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

    // return this.http.get<BookDTO[]>(this.apiUrl, { params }).pipe(
    return this.getMockBooks(filter).pipe(
      tap((books) => {
        this.updateLocalBooks(books);
      })
    );
  }

  saveBook(book: Book): Observable<Book> {
    return timer(300).pipe(
      // imitation of http request
      map(() => {
        const newId = Date.now(); // new id should be generated at backend
        const newBook = { ...book, id: newId };
        return newBook;
      }),
      tap((newBook) => this.addBook(newBook))
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

  // imitating http response
  getMockBooks(filter: BookFilter = {}): Observable<Book[]> {
    /* return existing books if they are already loaded, mock data otherwise */
    const mockBooks: Book[] = this.books.length
      ? this.books
      : [
          {
            id: 1,
            title: 'Harry Potter',
            author: { id: 1, name: 'Rowling' },
            description: 'Wizard story',
            genre: 'Fantasy' as Genre,
            language: 'English',
            pages: 350,
          },
          {
            id: 2,
            title: 'Game of Thrones',
            author: { id: 2, name: 'George Martin' },
            description: 'Epic fantasy series',
            genre: 'Fantasy' as Genre,
            language: 'English',
            pages: 800,
          },
          {
            id: 3,
            title: 'The Hobbit',
            author: {
              name: 'Tolkien',
              id: 3,
            },
            description: 'Adventure of Bilbo Baggins',
            genre: 'Fantasy' as Genre,
            language: 'English',
            pages: 300,
          },
          {
            id: 4,
            title: 'Crime and Punishment',
            author: { name: 'Dostoevsky', id: 4 },
            description: 'Psychological novel',
            genre: 'Classic' as Genre,
            language: 'Russian',
            pages: 500,
          },
        ];

    return timer(300).pipe(
      // Simulate network delay
      map(() => {
        let filteredBooks = [...mockBooks];

        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          filteredBooks = filteredBooks.filter(
            (book) =>
              book.title.toLowerCase().includes(searchLower) ||
              book.description.toLowerCase().includes(searchLower)
          );
        }

        if (filter.authorsIds && filter.authorsIds.length > 0) {
          const authorIds = filter.authorsIds.map((id) => Number(id));
          filteredBooks = filteredBooks.filter((book) =>
            authorIds.includes(book.author.id)
          );
        }

        if (filter.minPages) {
          filteredBooks = filteredBooks.filter(
            (book) => book.pages >= filter.minPages!
          );
        }

        if (filter.maxPages) {
          filteredBooks = filteredBooks.filter(
            (book) => book.pages <= filter.maxPages!
          );
        }

        if (filter.genre) {
          filteredBooks = filteredBooks.filter(
            (book) => book.genre === filter.genre
          );
        }

        return filteredBooks;
      })
    );
  }
}
