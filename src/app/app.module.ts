import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdAutocompleteModule, MdInputModule, MdSelectModule, MdDialogModule, MdTableModule, MdCardModule, MdPaginatorModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BooksComponent }  from './books.component';
import { BookComponent }  from './book.component';

import { BorrowDialogComponent } from './borrow-dialog.component';
import { SavedDialogComponent } from './saved-dialog.component';

import { CoreModule } from './core.module';

const appRoutes: Routes = [
  { path: 'books/:id',
    component: BookComponent,
    data: { title: 'Book Record' }
  },
  {
    path: 'books',
    component: BooksComponent,
    data: { title: 'Books List' }
  },
  { path: '',
    redirectTo: '/books',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    BooksComponent,
    BorrowDialogComponent,
    SavedDialogComponent
  ],
  imports: [
    CoreModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    BrowserAnimationsModule,
    BrowserModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdInputModule,
    MdSelectModule,
    MdDialogModule,
    MdTableModule,
    MdCardModule,
    MdPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
  entryComponents:[
    BorrowDialogComponent,
    SavedDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
