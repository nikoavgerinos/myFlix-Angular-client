
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

//Declaring the api url that will provide data for the client app
const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  // USER REGISTRATION - Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'register', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  // LOGIN - Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // ALL MOVIES - Making the api call for the allMovies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // SINGLE MOVIE - Making the api call for the GetOneGenre endpoint
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,

      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // SINGLE DIRECTOR - Making the api call for the getOneDirector endpoint
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + directorName, 
    {headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // SINGLE GENRE - Making the api call for the getOneGenre endpoint
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + genreName,
    {headers: new HttpHeaders (
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  
  // FAVORITE MOVIES LIST - making the api call for the getFavoriteMovies endpoint
  getFavoriteMovies(username:string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders (
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // ADD FAVORITE MOVIE - Making the api call for the addFavoriteMovies endpoint
  addFavoriteMovie(movieId: string, username: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(apiUrl + `users/${username}/${movieId}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  isFavoriteMovie(movieId: string, username: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.delete(apiUrl + `users/${username}/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //DELETE FAVORITE MOVIE - Making the api call for the deleteFavoriteMovie endpoint
  deleteFavoriteMovie(movieId: string, username: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.delete(apiUrl + `users/${username}/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
                //USER ENDPOINTS

  // SINGLE USER - Making the api call for the getOneUser endpoint
  getOneUser(Username: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }


  //EDIT USER - Making the api call for the editUser endpoint
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    //DELETE USER - Making the api call for the deleteUser endpoint
    deleteUser(): Observable<any> {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      return this.http.delete(apiUrl + 'users/' + user._id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        catchError(this.handleError)
      );
    }

     // Non-typed response extraction
    private extractResponseData(res: any): any {
      const body = res;
      return body || {};
  }

 
  

  private handleError(error: HttpErrorResponse): Observable<never> { // Update the return type to Observable<never>
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
          `Error Status code ${error.status}, ` +
          `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.')); // Use the new recommended signature
  }
}
  