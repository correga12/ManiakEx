import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { BookService } from './book.service';
import { DataSource } from '@angular/cdk/collections';
import { MdPaginator } from '@angular/material';

import 'rxjs/add/observable/of';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx'

@Component({
  selector: 'books',
  template: `
      <div class="example-container mat-elevation-z8">
        <div class="example-header">
          <md-form-field floatPlaceholder="never">
            <input mdInput #filter placeholder="Search Books">
          </md-form-field>
        </div>

        <md-table #table [dataSource]="dataSource">
          <ng-container mdColumnDef="id">
            <md-header-cell *mdHeaderCellDef> ID </md-header-cell>
            <md-cell *mdCellDef="let row"> {{row.id}} </md-cell>
          </ng-container>
          <ng-container mdColumnDef="name">
            <md-header-cell *mdHeaderCellDef> Name </md-header-cell>
            <md-cell *mdCellDef="let row"> {{row.name}} </md-cell>
          </ng-container>
          <ng-container mdColumnDef="author">
            <md-header-cell *mdHeaderCellDef> Author </md-header-cell>
            <md-cell *mdCellDef="let row"> {{row.author}} </md-cell>
          </ng-container>
          <ng-container mdColumnDef="published_at">
            <md-header-cell *mdHeaderCellDef> Published </md-header-cell>
            <md-cell *mdCellDef="let row"> {{row.published_at}} </md-cell>
          </ng-container>
          <ng-container mdColumnDef="category">
            <md-header-cell *mdHeaderCellDef> Category </md-header-cell>
            <md-cell *mdCellDef="let row"> {{row.category.name}} </md-cell>
          </ng-container>
          <ng-container mdColumnDef="view">
            <md-header-cell *mdHeaderCellDef></md-header-cell>
            <md-cell *mdCellDef="let row">
              <a routerLink="/books/{{row.id}}" routerLinkActive="active">View</a>
            </md-cell>
          </ng-container>
          <md-header-row *mdHeaderRowDef="displayedColumns"></md-header-row>
          <md-row *mdRowDef="let row; columns: displayedColumns;"></md-row>
        </md-table>
        <md-paginator #paginator [length]="exampleDatabase.data.length" [pageIndex]="0"
        [pageSize]="3" [pageSizeOptions]="[5, 10, 25, 100]">
        </md-paginator>
      </div>
  `,
})
export class BooksComponent implements OnInit {
  displayedColumns = ['id', 'name', 'author', 'category', 'published_at', 'view'];
  dataSource: ExampleDataSource | null;
  exampleDatabase = new ExampleDatabase(this.bookService);
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(
    private bookService: BookService,
  ){
  }

  ngOnInit(){
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.bookService, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource['filter'] = this.filter.nativeElement.value;
    });
  }
}

export interface Element {
  name: string;
}

export class ExampleDatabase {
  dataChange: BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);
  get data(): Element[] { return this.dataChange.value; }

  constructor(
    private bookService: BookService,
  ) {
    this.dataChange.next(this.bookService.get(null));
  }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(
    private _exampleDatabase: ExampleDatabase,
    private bookService: BookService,
    private _paginator: MdPaginator,
  ){
    super();
  }

  connect(): Observable<Element[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._paginator.page,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._exampleDatabase.data.slice();
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize).filter((item: any) => {
        let searchStr = (item.name + item.category + item.author).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
