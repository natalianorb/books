import { Routes } from '@angular/router';
import { AuthorsComponent } from './components/authors/authors.component';
import { BooksListComponent } from './components/books-list/books-list.component';

export const routes: Routes = [
  {
    path: '',
    component: BooksListComponent,
  },
  {
    path: 'authors',
    component: AuthorsComponent,
  },
];
