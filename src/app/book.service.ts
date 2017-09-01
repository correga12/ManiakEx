import { Injectable, Inject, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Injectable()

export class BookService {
  books: Array<Object> = [
    {
      id: 0,
      name : 'Book title',
      author: 'John Doe',
      category: {id: 0, name: 'Thriller'},
      published_at: '1 September, 2017',
    },
    {
      id: 1,
      name : 'Book title',
      author: 'John Doe',
      category: {id: 0, name: 'Thriller'},
      published_at: '1 September, 2017',
    },
    {
      id: 2,
      name : 'Book title',
      author: 'John Doe',
      category: {id: 0, name: 'Thriller'},
      published_at: '1 September, 2017',
    },
    {
      id: 3,
      name : 'Book title',
      author: 'John Doe',
      category: {id: 0, name: 'Thriller'},
      published_at: '1 September, 2017',
    },
  ];
  public onBooksChanged: EventEmitter<Object> = new EventEmitter();

  constructor(){
  }

  public create(data:any){
    data['id'] = this.books.length ? (this.books.length - 1) : 0;
    this.books.push(data);
    this.onBooksChanged.next(this.books);
    return this.onBooksChanged;
  }

  public get(id:any){
    if(id){
      return _.find(this.books, (book: Object) => book['id'] == id);
    }
    return this.books;
  }

  public delete(id:any){
    let bookToDelete = _.find(this.books, book => book['id'] == id);
    this.books.splice(this.books.indexOf(bookToDelete), 1);
    this.onBooksChanged.next(this.books);
    return this.onBooksChanged;
  }

  public update(id:any, book){
    this.books[id] = book;
  }
}
