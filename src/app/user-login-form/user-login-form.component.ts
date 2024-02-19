import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user login form.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {

  /** User data for login. */
  @Input() userData = { Username: '', Password: '' }

  /**
   * Constructs the UserLoginFormComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param dialogRef - Reference to the MatDialogRef service.
   * @param snackBar - Service for displaying snack bar messages.
   * @param router - Router for navigating to different routes.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Logs in a user.
   */
  public loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close();
      this.snackBar.open('User login successful', 'OK', {
        duration: 2000, verticalPosition: 'top'
      });
      this.router.navigate(['movies'])
    }, (result) => {
      console.log(result);
      this.snackBar.open('User login failed', 'OK', {
        duration: 2000, verticalPosition: 'top'
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
      this.loginUser(); // Call your loginUser function when Enter key is pressed
    }
  }
}
