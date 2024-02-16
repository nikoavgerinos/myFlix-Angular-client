import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

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
