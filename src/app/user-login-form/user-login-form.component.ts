import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' }

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginUser(): void {
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

  // Listen for the keyup event on the document
  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed (keyCode 13)
    if (event.key === 'Enter') {
      this.loginUser(); // Call your loginUser function when Enter key is pressed
    }
  }
}
