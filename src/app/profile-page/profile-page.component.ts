import { Component, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component'; // Import the UserUpdateFormComponent
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = { Username: '', Password: '', Email: '', Birth: '', favorite_movies: [] };
  favouriteMovies: any[] = [];

  constructor(
    public fetchApi: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  public loadUser(): void {
    this.fetchApi.getOneUser().subscribe((userData: any) => {
      this.user = userData;
      this.user.favorite_movies = userData.FavoriteMovies || [];

      this.fetchApi.getAllMovies().subscribe((response) => {
        this.favouriteMovies = response.filter((movie: any) => this.user.favorite_movies.includes(movie._id));
      });
    });
  }

  public deleteUser(): void {
    // Call your API service method to delete the user
    this.fetchApi.deleteUser().subscribe(() => {
      // Assuming successful deletion, you can redirect or show a success message
      this.router.navigate(['logout']); // Redirect to logout or another route
    }, (error) => {
      console.error('Error deleting user:', error);
      // Handle error (show error message, etc.)
    });
  }

  public back(): void {
    this.router.navigate(['movies']);
  }

  public openUpdateUserForm(): void {
    // Open the UserUpdateFormComponent in a dialog
    const dialogRef = this.dialog.open(UserUpdateFormComponent, {
      width: '400px',
      data: this.user // Pass the user data to the dialog
    });

    // Subscribe to the afterClosed event to handle any result from the dialog
    dialogRef.afterClosed().subscribe((result) => {
      // Handle the result as needed, e.g., update the user data in the component
      if (result) {
        this.user = result;
      }
    });
  }
}
