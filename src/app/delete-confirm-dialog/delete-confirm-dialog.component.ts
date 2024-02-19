import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component representing the delete confirmation dialog.
 * @selector 'app-delete-confirm-dialog'
 * @templateUrl './delete-confirm-dialog.component.html'
 * @styleUrls ['./delete-confirm-dialog.component.scss']
 */
@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {

  /**
   * Constructor for DeleteConfirmDialogComponent.
   * @param dialogRef - Reference to the dialog component.
   * @param data - Data passed to the dialog component.
   */
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Function called when the cancel button is clicked.
   * Closes the dialog and emits false indicating cancellation.
   */
  onCancelClick(): void {
    this.dialogRef.close(false); // User canceled the deletion
  }

  /**
   * Function called when the confirm button is clicked.
   * Closes the dialog and emits true indicating confirmation.
   */
  onConfirmClick(): void {
    this.dialogRef.close(true); // User confirmed the deletion
  }
}
