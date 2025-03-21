import { Author } from './author.model';

export interface Book {
  id: number;
  title: string;
  description: string;
  author: Author;
  language: string;
  pages: number;
  genre: string;
}

export interface BookFilter {
  search?: string;
  authorsIds?: number[];
  minPages?: number;
  maxPages?: number;
  genre?: string;
}
