import { Component } from '@angular/core';
import { BookService } from './book.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {MdDialog, MD_DIALOG_DATA} from '@angular/material';
import { BorrowDialogComponent } from './borrow-dialog.component';
import { SavedDialogComponent } from './saved-dialog.component';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Component({
  selector: 'book',
  template: `
    <h1>Books component</h1>
    <section *ngIf="!formMode && book && book.name">
      <md-card>
        <md-card-title>{{book.name}}</md-card-title>
        <md-card-subtitle>{{book.author}}</md-card-subtitle>
        <md-card-content>
          <p>
            <label>Category:</label>
            <span> {{book.category.name}} </span>
          </p>
          <p>
            <label>Published:</label>
            <span> {{book.published_at}} </span>
          </p>
          <p>
            <label>Available:</label>
            <span> {{book.borrowed_to ? 'Unavailable' : 'Available'}}</span>
          </p>
          <p *ngIf="book.borrowed_to">
            <label>Borrowed to:</label>
            <span> {{book.borrowed_to}} </span>
          </p>
          <md-card-actions>
            <button md-button (click)="edit(book)">Edit</button>
            <button md-button (click)="borrow(book)">Borrow</button>
            <button md-button (click)="delete(book)">Delete</button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </section>

    <form [formGroup]="bookForm" novalidate *ngIf="formMode" (ngSubmit)="create()">
      <md-input-container>
        <input mdInput type="text" formControlName="name" [(ngModel)]="book.name" placeholder="Name">
        <md-error>Please enter a valid name</md-error>
      </md-input-container>

        <md-input-container>
          <input mdInput type="text" formControlName="author" [(ngModel)]="book.author" placeholder="Author">
          <md-error>Please add an author</md-error>
        </md-input-container>

      <md-form-field>
        <input type="text" mdInput formControlName="category" [(ngModel)]="book.category" [mdAutocomplete]="auto" placeholder="Select category">
        <md-error>Please enter a valid category</md-error>
      </md-form-field>

      <md-autocomplete #auto="mdAutocomplete" [displayWith]="displayFn">
        <md-option *ngFor="let option of filteredOptions | async" [value]="option">
           {{ option.name }}
        </md-option>
      </md-autocomplete>

        <md-input-container>
          <input mdInput type="text" formControlName="published_at" [(ngModel)]="book.published_at" placeholder="Published Date" tabindex="2">
          <md-error>Please add an published date</md-error>
        </md-input-container>

      <button md-button type="submit"color="primary">Save</button>
    </form>
  `,
})
export class BookComponent  {
  categories: Array<Object> = [];
  book: Object = {
    available: true
  };
  bookToEdit: Boolean;
  fb: any;
  bookForm: any;
  formMode: Boolean = true;
  filteredOptions: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public dialog: MdDialog
  ){
    this.fb = new FormBuilder();
    this.resetForm();
    this.loadCategories();
  }

  resetForm(){
    this.book = {available: true };
    this.bookForm = this.fb.group({
      'name' : [null, Validators.required],
      'category' : [null,  Validators.required],
      'author' : [null,  Validators.required],
      'published_at' : [null,  Validators.required],
    });
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      if(params['id'] == 'new'){
        this.formMode = true;
      }else{
        this.book = this.bookService.get(params['id']);
        this.formMode = false;
      }
    });
  }

  loadCategories(){
    this.categories = [
      {id: 0, name: 'Thriller', description: 'Lorem ipsum'},
      {id: 1, name: 'Cience Fiction', description: 'Lorem ipsum' },
      {id: 2, name: 'History', description: 'Lorem ipsum'},
      {id: 3, name: 'Novel', description: 'Lorem ipsum'},
    ];
    this.filteredOptions = this.bookForm.controls.category.valueChanges.startWith(null)
        .map(category => category && typeof category === 'object' ? category['name'] : category)
        .map(name => name ? this.filter(name) : this.categories);
  }

  filter(name: string): any[] {
    return this.categories.filter(option => option['name']['toLowerCase']().match(name.toLowerCase()));
  }

  borrow(book: Object){
    let dialogRef = this.dialog.open(BorrowDialogComponent, {
      height: '250px',
      width: '300px',
      data: book,
    });
    dialogRef.afterClosed().subscribe(result => {
      book['borrowed_to'] = result;
      this.bookService.update(book['id'], book);
    });
  }

  edit(book){
    this.bookToEdit = book;
    this.book = book;
    this.formMode = true;
  }

  delete(book: Object){
    this.bookService.delete(book['id'])
    this.router.navigate(['/books']);
  }

  create(){
    if(this.bookForm.invalid){return;}
    if(this.bookToEdit){
      this.bookService.update(this.bookToEdit['id'], _.clone(this.book));
      this.bookToEdit = false;
      this.formMode = false;
    }else{
      this.bookService.create(_.clone(this.book)).subscribe((r:any) => {});
      let dialogRef = this.dialog.open(SavedDialogComponent, {
        height: '150px', width: '150px',
      });
    }
    this.resetForm();
  }

  displayFn(category: any): string {
    return category ? category.name : category;
  }
}
