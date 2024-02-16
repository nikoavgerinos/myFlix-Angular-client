import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];

  constructor(public fetchApiData: FetchApiDataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

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

  isFavorite(movieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(movieId);
  }
}
