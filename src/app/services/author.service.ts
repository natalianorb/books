import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Author, AuthorDTO } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiUrl = '/api/authors';

  constructor(private http: HttpClient) {}

  getAuthorsByIds(ids: string[]): Observable<Author[]> {
    const uniqueIds = [...new Set(ids)];
    const requests = uniqueIds.map((id) => this.getAuthorById(id));

    if (!requests.length) {
      return of([]);
    }
    return forkJoin(requests);
  }

  private getAuthorById(id: string): Observable<Author> {
    return this.http.get<AuthorDTO>(`${this.apiUrl}/${id}`).pipe(
      map((author) => this.transformAuthor(author)),
    );
  }

  private transformAuthor(author: AuthorDTO): Author {
    return {
      id: author.id,
      name: author.surname? `${author.name} ${author.surname}` : author.name,
    };
  }

  loadAuthors(): Observable<Author[]> {
    return this.http.get<AuthorDTO[]>(this.apiUrl).pipe(
      map((authors) => authors.map(this.transformAuthor)),
    );
  }

  createAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    return this.http
      .post<Author>(this.apiUrl, author);
  }

  updateAuthor(author: Author): Observable<Author> {
    return this.http.put<AuthorDTO>(`${this.apiUrl}/${author.id}`, author);
  }

  deleteAuthor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
