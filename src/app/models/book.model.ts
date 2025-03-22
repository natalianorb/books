import { Author } from './author.model';
import { Genre } from './genre.model';

export interface Book {
  id: string;
  title: string;
  description: string;
  author: Author;
  language: string;
  pages: number;
  genre: Genre;
}

export interface BookDTO {
  id: string;
  title: string;
  author_id: string;
  pages: number;
}


export interface BookFilter {
  search?: string;
  authorsIds?: string[];
  minPages?: number;
  maxPages?: number;
  genre?: Genre;
}
