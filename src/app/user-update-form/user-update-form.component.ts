import { Component, Inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for updating user information.
 */
@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrls: ['./user-update-form.component.scss']
})
export class UserUpdateFormComponent implements OnInit {

  /** Object containing updated user data. */
  updatedUser: any;
  /** New password entered by the user. */
  newPassword: string = "";
  /** Reference to the user update form. */
  @ViewChild('userForm') userForm!: NgForm;

  /**
   * Constructs the UserUpdateFormComponent.
   * @param dialogRef - Reference to the dialog opened.
   * @param data - Data passed into the dialog.
   * @param fetchApiData - Service for fetching API data.
   * @param snackBar - Service for displaying snack bar messages.
   * @param matDialog - Reference to the MatDialog service.
   */
  constructor(
    public dialogRef: MatDialogRef<UserUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.updatedUser = { ...this.data };
  }

  /**
   * Updates the user information.
   */
  onUpdateUser(): void {
    // Set the new password to the updatedUser object only if a new password is entered
    if (this.newPassword.trim() !== "") {
      this.updatedUser.Password = this.newPassword;
    } else {
      // If no new password is entered, delete the Password property from updatedUser
      delete this.updatedUser.Password;
    }

    // Call your API service method to update the user
    this.fetchApiData.editUser(this.updatedUser).subscribe(
      (result) => {
        this.snackBar.open('User updated successfully', 'OK', {
          duration: 2000, verticalPosition: 'top'
        });
        this.dialogRef.close(this.updatedUser);
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000, verticalPosition: 'top'
        });
      }
    );
  }

  /**
   * Closes the dialog without updating the user.
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Handles key up events.
   * @param event - The keyboard event.
   */
  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed (keyCode 13)
    if (event.key === 'Enter') {
      this.onUpdateUser(); // Call your onUpdateUser function when Enter key is pressed
    }
  }
}
