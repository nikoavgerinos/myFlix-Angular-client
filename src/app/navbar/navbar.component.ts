import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for the navigation bar.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  /**
   * Constructs the NavbarComponent.
   * @param router - Router for navigation.
   * @param snackBar - MatSnackBar for displaying snack bar messages.
   */
  constructor(
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Opens the user profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Opens the movies page.
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Logs out the user.
   */
  public logout(): void {
    // Clear user session or token (replace with your authentication logic)
    localStorage.removeItem('userToken'); // Example: assuming you store a token in localStorage

    // Show snackbar notification
    this.snackBar.open('Logout successful', 'Close', {
      duration: 2000, verticalPosition: 'top'
    });

    // Redirect to the welcome page after logout
    this.router.navigate(['welcome']);
  }
}
