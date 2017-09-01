import {Component, Inject} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  template: `
    <h2 md-dialog-title></h2>
    <md-dialog-content>Book created!</md-dialog-content>
    <md-dialog-actions>
      <button md-button md-dialog-close>Ok</button>
    </md-dialog-actions>
  `
})

export class SavedDialogComponent {
  constructor(
    public dialogRef: MdDialogRef<SavedDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    }
}
