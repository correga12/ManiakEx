import {Component, Inject} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  template: `
    <h2 md-dialog-title>Borrow a Book</h2>
    <md-dialog-content>Would you like to borrow a book?</md-dialog-content>
    <form [formGroup]="bookForm" novalidate *ngIf="formMode">
      <md-input-container>
        <input mdInput type="text" formControlName="userName" [(ngModel)]="userName" placeholder="Enter User Name">
        <md-error>Please enter a valid name </md-error>
      </md-input-container>
    </form>
    <md-dialog-actions>
      <button md-button md-dialog-close>No</button>
      <button md-button (click)="closeDialog()">Yes</button>
    </md-dialog-actions>
  `
})

export class BorrowDialogComponent {
  fb: any;
  bookForm: any;
  formMode: Boolean = true;
  userName: string;

  constructor(
    public dialogRef: MdDialogRef<BorrowDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {

    this.fb = new FormBuilder();
    this.bookForm = this.fb.group({
      'userName' : [null, Validators.required],
    });
  }

  closeDialog(){
    this.dialogRef.close(this.userName);
  }
}
