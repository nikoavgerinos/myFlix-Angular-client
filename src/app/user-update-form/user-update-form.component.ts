import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrls: ['./user-update-form.component.scss']
})
export class UserUpdateFormComponent implements OnInit {

  updatedUser: any;

  constructor(
    public dialogRef: MatDialogRef<UserUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialize the updatedUser object with the current user data
    this.updatedUser = { ...this.data };
  }

  onUpdateUser(): void {
    // Call your API service method to update the user
    this.fetchApiData.editUser(this.updatedUser).subscribe(
      (result) => {
        this.snackBar.open('User updated successfully', 'OK', {
          duration: 2000
        });
        this.dialogRef.close(this.updatedUser);
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000
        });
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Listen for the keyup event on the document
  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed (keyCode 13)
    if (event.key === 'Enter') {
      this.onUpdateUser(); // Call your onUpdateUser function when Enter key is pressed
    }
  }
}
