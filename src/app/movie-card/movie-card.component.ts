import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

/**
 * Component representing a movie card.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  /**
   * Constructs the MovieCardComponent.
   * @param fetchApiData - Service for fetching API data.
   * @param snackBar - MatSnackBar for displaying snack bar messages.
   * @param dialog - MatDialog for opening dialog components.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Retrieves all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  /**
   * Opens a dialog displaying information about a genre.
   * @param name - The name of the genre.
   * @param description - The description of the genre.
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * Opens a dialog displaying information about a director.
   * @param name - The name of the director.
   * @param bio - The biography of the director.
   * @param birth - The birth date of the director.
   * @param death - The death date of the director.
   */
  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death
      },
      width: '450px',
    });
  }

  /**
   * Opens a dialog displaying the synopsis of a movie.
   * @param description - The description of the movie.
   */
  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * Toggles the favorite status of a movie.
   * @param movieId - The ID of the movie.
   */
  toggleFavorite(movieId: string): void {
    const isCurrentlyFavorite = this.fetchApiData.isFavoriteMovie(movieId);

    if (isCurrentlyFavorite) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      });
    } else {
      this.fetchApiData.addFavoriteMovies(movieId).subscribe(() => {
        this.snackBar.open('Added to favorites', 'OK', { duration: 2000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      });
    }
  }

  /**
   * Checks if a movie is in the favorites list.
   * @param movieId - The ID of the movie.
   * @returns True if the movie is in the favorites list, otherwise false.
   */
  isFavorite(movieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(movieId);
  }
}
