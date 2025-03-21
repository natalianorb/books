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

export interface BookDTO {
  id: number;
  title: string;
  description: string;
  author: Author;
  language: string;
  pages: number[];
  genre: string[];
}

export interface BookFilter {
  search?: string;
  authors?: number[];
  minPages?: number;
  maxPages?: number;
  genre?: string;
}
