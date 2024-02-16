// user-update-form.component.ts

import { Component, Inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrls: ['./user-update-form.component.scss']
})
export class UserUpdateFormComponent implements OnInit {

  updatedUser: any;
  newPassword: string = "";
  @ViewChild('userForm') userForm!: NgForm;

  constructor(
    public dialogRef: MatDialogRef<UserUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.updatedUser = { ...this.data };
  }

  onUpdateUser(): void {
    // Set the new password to the updatedUser object only if a new password is entered
    if (this.newPassword.trim() !== "") {
      this.updatedUser.Password = this.newPassword;
    } else {
      // If no new password is entered, remove the Password property from updatedUser
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

  onCancel(): void {
    this.dialogRef.close();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed (keyCode 13)
    if (event.key === 'Enter') {
      this.onUpdateUser(); // Call your onUpdateUser function when Enter key is pressed
    }
  }
}
