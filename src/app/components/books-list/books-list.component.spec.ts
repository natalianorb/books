import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BooksListComponent } from './books-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { Book } from '../../models/book.model';
import { By } from '@angular/platform-browser';
import { Author } from '../../models/author.model';
import { provideRouter } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';
import { GenresService } from '../../services/genres.service';
import { click } from '../../tests/click.helper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BooksListComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        MessageService,
        provideRouter([]),
        BookService,
        AuthorService,
        GenresService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should show modal when book row is clicked (click helper with DebugElement)', fakeAsync(() => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book 1',
      description: 'Description 1',
      author: { id: '1', name: 'Author 1' } as Author,
      pages: 200,
      language: 'English',
      genre: 'Fiction',
    };
    component.books = [mockBook];
    fixture.detectChanges();

    const bookRowDebugEl = fixture.debugElement.query(By.css('tr.cursor-pointer'));
    const modalDebugEl = fixture.debugElement.query(By.css('p-dialog'));

    expect(bookRowDebugEl).toBeTruthy();
    expect(modalDebugEl).toBeTruthy();

    click(bookRowDebugEl);

    expect(component.displayDialog).toBeTrue();
    expect(modalDebugEl.nativeElement.style.display).not.toBe('none');
  }));
});
