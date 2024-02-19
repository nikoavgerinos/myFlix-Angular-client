import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user registration form.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /** User data for registration. */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructs the UserRegistrationFormComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param dialogRef - Reference to the MatDialogRef service.
   * @param snackBar - Service for displaying snack bar messages.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Registers a new user.
   */
  public registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      this.dialogRef.close();
      this.snackBar.open('Registration successful', 'OK', {
        duration: 2000, verticalPosition: 'top'
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Listens for the keyup event on the document.
   * @param event - The keyboard event.
   */
  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed (keyCode 13)
    if (event.key === 'Enter') {
      this.registerUser(); // Call your registerUser function when Enter key is pressed
    }
  }
}
