import { Component, Input, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = { Username: '', Password: '', Email: '', Birth: '', favorite_movies: [] };
  favouriteMovies : any[] = [];
  constructor(public fetchApi: FetchApiDataService,
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

  public back(): void {
    this.router.navigate(['movies']);
  }



}