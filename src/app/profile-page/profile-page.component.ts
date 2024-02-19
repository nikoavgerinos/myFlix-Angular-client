import { Component, Input, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

/**
 * Component for the user profile page.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfileComponent implements OnInit {

  /** User data. */
  user: any = { Username: '', Password: '', Email: '', Birth: '' };

  /** Array of favorite movies. */
  FavoriteMovies: any[] = [];

  /** Array of all movies. */
  movies: any[] = [];

  /** Array of favorite movies. */
  favorites: any[] = [];

  /**
   * Constructs the ProfileComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param router - Router for navigation.
   * @param dialog - MatDialog for opening dialog windows.
   * @param snackBar - MatSnackBar for displaying snack bar messages.
   * @param matDialog - MatDialog for opening dialog windows.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.loadUser();
    this.getAllMovies();
  }

  /**
   * Loads user data.
   */
  public loadUser(): void {
    this.fetchApiData.getOneUser().subscribe(
      (userData) => {
        this.user = userData;
        this.fetchApiData.getAllMovies().subscribe((response) => {
          this.FavoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
        });
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }

  /**
   * Navigates back to movies page.
   */
  public back(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Opens the user update form dialog.
   */
  openUpdateUserForm(): void {
    const dialogRef = this.matDialog.open(UserUpdateFormComponent, {
      width: '400px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = result;
      }
    });
  }

  /**
   * Deletes the user account.
   */
  deleteUser(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { confirmationMessage: 'Do you want to delete your account permanently?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // User confirmed the deletion
        this.router.navigate(['welcome']).then(() => {
          localStorage.clear();
          this.snackBar.open('Your account has been deleted', 'OK', {
            duration: 3000, verticalPosition: 'top'
          });
        });

        this.fetchApiData.deleteUser().subscribe((deleteResult) => {
          console.log(deleteResult);
        });
      }
    });
  }

  /**
   * Retrieves all movies.
   */
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens dialog to display genre information.
   * @param genre - The genre information to display.
   */
  public getGenre(genre: any) {
    this.dialog.open(GenreInfoComponent, { width: '400px', height: '300px', data: { genre: genre } });
  }

  /**
   * Opens dialog to display director information.
   * @param director - The director information to display.
   */
  public getOneDirector(director: any) {
    this.dialog.open(DirectorInfoComponent, { width: '400px', height: '300px', data: { director: director } });
  }

  /**
   * Opens dialog to display movie details.
   * @param details - The movie details to display.
   */
  public openMovieDetails(details: string) {
    this.dialog.open(MovieSynopsisComponent, { width: '400px', height: '300px', data: { details: details } });
  }

  /**
   * Toggles movie favorite status.
   * @param movieId - The ID of the movie to toggle favorite status.
   */
  toggleFavorite(movieId: string): void {
    const isCurrentlyFavorite = this.fetchApiData.isFavoriteMovie(movieId);

    if (isCurrentlyFavorite) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    } else {
      this.fetchApiData.addFavoriteMovies(movieId).subscribe(() => {
        this.snackBar.open('Added to favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    }
  }

  /**
   * Removes a movie from favorites.
   * @param movieId - The ID of the movie to remove from favorites.
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      this.FavoriteMovies = this.FavoriteMovies.filter((movie: any) => movie._id !== movieId);
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
    });
  }
}
