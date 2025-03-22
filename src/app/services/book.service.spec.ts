import { HttpClient } from '@angular/common/http';
import { Book, BookDTO } from '../models/book.model';
import { BookService } from './book.service';
import { AuthorService } from './author.service';
import { of } from 'rxjs';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let bookService: BookService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const fakeAuthorsService = {
    getAuthorsByIds() {
      const authors = [
        {
          id: 'c479',
          name: 'Leo Tolstoy',
        },
        {
          id: 'b46b',
          name: 'Fyodor Dostoevsky',
        },
      ];
      console.log('authors ', authors);
      return of(authors);
    },
  };
  bookService = new BookService(
    httpClientSpy,
    fakeAuthorsService as unknown as AuthorService
  );
});

it('should return expected books', (done: DoneFn) => {
  const bookDTOs: BookDTO[] = [
    {
      id: '4443',
      title: 'le',
      author_id:  'c479',
      description: '',
      pages: 213,
      language: 'German',
      genre: 'Fantasy',
    },
    {
      id: 'e644',
      title: 'fed',
      author_id: 'b46b',
      description: '',
      pages: 3450,
      language: 'German',
      genre: 'Fantasy',
    },
  ];


  const expectedBooks: Book[] = [
    {
      id: '4443',
      title: 'le',
      author: {
        id: 'c479',
        name: 'Leo Tolstoy',
      },
      description: '',
      pages: 213,
      language: 'German',
      genre: 'Fantasy',
    },
    {
      id: 'e644',
      title: 'fed',
      author: {
        id: 'b46b',
        name: 'Fyodor Dostoevsky',
      },
      description: '',
      pages: 3450,
      language: 'German',
      genre: 'Fantasy',
    },
  ];
  httpClientSpy.get.and.returnValues(of(bookDTOs));
  bookService.loadBooks().subscribe({
    next: (books) => {
      expect(books).withContext('expected books').toEqual(expectedBooks);
      done();
    },
    error: done.fail,
  });
});



