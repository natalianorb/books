import { Author } from './author.model';
import { Genre } from './genre.model';

export interface Book {
  id: number;
  title: string;
  description: string;
  author: Author;
  language: string;
  pages: number;
  genre: Genre;
}

export interface BookFilter {
  search?: string;
  authorsIds?: number[];
  minPages?: number;
  maxPages?: number;
  genre?: Genre;
}
