import { Component, Input, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

/**
 * @description Component representing the navigation bar.
 * @selector 'app-profile'
 * @templateUrl './profile-page.component.html'
 * @styleUrls ['./profile-page.component.scss']
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})

export class ProfileComponent implements OnInit {

  user: any = { Username: '', Password: '', Email: '', Birth: '' };

  FavoriteMovies : any[] = [];
  movies: any[] = [];
  favorites: any[] = [];
  
  constructor(public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }


  ngOnInit(): void { 
    this.loadUser();
    this.getAllMovies();
  }

  

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

  public back(): void {
    this.router.navigate(['movies']);
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
  

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

 

    public getGenre(genre: any){
      this.dialog.open(GenreInfoComponent, { width: '400px', height: '300px', data: {genre: genre}});
    }

   
    public getOneDirector(director: any){
      this.dialog.open(DirectorInfoComponent, { width: '400px', height: '300px', data: {director: director}});
    }  

  

    public openMovieDetails(details: string){
      this.dialog.open(MovieSynopsisComponent, { width: '400px', height: '300px', data: {details: details}});
    }
  
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
  
    removeFromFavorites(movieId: string): void {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
        this.FavoriteMovies = this.FavoriteMovies.filter((movie: any) => movie._id !== movieId);
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top' });
      });
    }  
  }
  