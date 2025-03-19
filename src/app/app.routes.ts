import { Routes } from '@angular/router';
import { CreateBookComponent } from './components/create-book/create-book.component';
import { CreateAuthorComponent } from './components/create-author/create-author.component';
import { AuthorsComponent } from './components/authors/authors.component';

export const routes: Routes = [
  {
    path: '',
    component: CreateBookComponent,
  },
  {
    path: 'authors',
    component: AuthorsComponent,
  },
  {
    path: 'create-author',
    component: CreateAuthorComponent,
  },
];
