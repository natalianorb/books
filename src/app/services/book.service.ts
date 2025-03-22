import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Book, BookDTO, BookFilter } from '../models/book.model';
import { AuthorService } from './author.service';
import { Genre } from '../models/genre.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = '/api/books';

  constructor(private http: HttpClient, private authorService: AuthorService) {}

  loadBooks(filter: BookFilter = {}): Observable<Book[]> {
    let params = new HttpParams();

    if (filter.search) {
      params = params.set('title', filter.search);
      params = params.set('description', filter.search);
    }

    if (filter.authorsIds && filter.authorsIds.length > 0) {
      params = params.append('author_id', filter.authorsIds.toString());
    }

    if (filter.minPages) {
      params = params.set('pages_gte', filter.minPages.toString());
    }

    if (filter.maxPages) {
      params = params.set('pages_lte', filter.maxPages.toString());
    }

    if (filter.genre) {
      params = params.set('genre', filter.genre);
    }

    return this.http.get<BookDTO[]>(this.apiUrl, { params }).pipe(
      switchMap((books) => {
        const authorsIds = books.map((book) => book.author_id);
        return this.authorService.getAuthorsByIds(authorsIds).pipe(
          map((authors) => {
            return books.map((book) => {
              const foundAuthor = authors.find(
                (author) => author.id === book.author_id
              );
              return this.transformToBook(book, foundAuthor!);
            });
          })
        );
      }),
    );
  }

  createBook(book: Omit<BookDTO, 'id'>): Observable<Book> {
    return this.http.post<BookDTO>(this.apiUrl, book).pipe(
      switchMap((newBook) => {
        return this.authorService.getAuthorsByIds([newBook.author_id]).pipe(
          map((authors) => {
            const foundAuthor = authors.find(
              (author) => author.id === newBook.author_id
            );
            return this.transformToBook(newBook, foundAuthor!);
          })
        );
      }),
    );
  }

  transformToBook(book: BookDTO, author: Author): Book {
    if (!author) {
      throw new Error('Author not found for the provided ID.');
    }
    if (book.author_id !== author.id) {
      throw new Error('Author ID does not match the provided author.');
    }

    return {
      id: book.id,
      title: book.title,
      pages: book.pages,
      author: { id: book.author_id, name: author.name },
      description: book.description,
      genre: book.genre as Genre,
      language: book.language,
    };
  }
}
