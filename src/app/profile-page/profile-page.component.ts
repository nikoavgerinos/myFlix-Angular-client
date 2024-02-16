// profile-page.component.ts

import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

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
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.fetchApi.getOneUser().subscribe((userData: any) => {
      this.user = userData;
      this.user.favorite_movies = userData.FavoriteMovies || [];

      this.fetchApi.getAllMovies().subscribe((response) => {
        this.favouriteMovies = response.filter((movie: any) => this.user.favorite_movies.includes(movie._id));
      });
    });
  }

  deleteUser(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { username: this.user.Username }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchApi.deleteUser().subscribe(() => {
          this.snackBar.open('User deleted successfully', 'OK', { duration: 2000 });
          // Redirect or perform other actions as needed
        }, (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user', 'OK', { duration: 2000 });
        });
      }
    });
  }

  back(): void {
    // Redirect to the movies page or perform other actions as needed
  }

  openUpdateUserForm(): void {
    const dialogRef = this.dialog.open(UserUpdateFormComponent, {
      width: '400px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = result;
      }
    });
  }

  toggleFavorite(movieId: string): void {
    const isCurrentlyFavorite = this.fetchApi.isFavoriteMovie(movieId);

    if (isCurrentlyFavorite) {
      this.fetchApi.deleteFavoriteMovie(movieId).subscribe(() => {
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    } else {
      this.fetchApi.addFavoriteMovies(movieId).subscribe(() => {
        this.snackBar.open('Added to favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    }
  }

  removeFromFavorites(movieId: string): void {
    this.fetchApi.deleteFavoriteMovie(movieId).subscribe(() => {
      this.favouriteMovies = this.favouriteMovies.filter((movie: any) => movie._id !== movieId);
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
    });
  }
}
