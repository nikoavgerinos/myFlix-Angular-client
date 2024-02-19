
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map,  } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://nikolaos-myflix-f421700e5033.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService { 

  private userData = new BehaviorSubject<Object>({ Username: '', Password: '', Email: '', Birth: ''});
  currentUser = this.userData.asObservable();

  private movies = new BehaviorSubject<Object>({});
  moviesList = this.movies.asObservable();

  constructor(private http: HttpClient) {
  }

  // User registration endpoint
  
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails,).pipe(
    catchError(this.handleError)
    );
  }

  // User login endpoint

  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Get all movies endpoint

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get one movie endpoint

  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director endpoint

  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get genre endpoint

  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

// Get user endpoint

getOneUser(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return of(user);
}

  // Get favourite movies for a user endpoint

  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username + '/favorites', {
      headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  // Add a movie to favourite Movies endpoint

  addFavoriteMovies(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/favorites/' + movieId, {}, {
      headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete a movie from the favorite movies endpoint

  deleteFavoriteMovie(movieId: string): Observable<any> {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (!userStr || !token) {
      // Handle missing user or token
      return throwError("User data or token not found in localStorage");
    }
  
    const user = JSON.parse(userStr);
  
    if (!Array.isArray(user.FavoriteMovies)) {
      // Handle case where FavoriteMovies is not an array
      return throwError("FavoriteMovies is not an array");
    }
  
    const index = user.FavoriteMovies.indexOf(movieId);
    if (index > -1) {
      // Create a copy of FavoriteMovies array and remove the movieId
      const updatedFavorites = user.FavoriteMovies.slice();
      updatedFavorites.splice(index, 1);
  
      // Update the user object with the modified FavoriteMovies array
      const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
  
      // Update localStorage with the modified user object
      localStorage.setItem('user', JSON.stringify(updatedUser));
  
      // Make the DELETE request to remove the movie from favorites on the server
      return this.http.delete(apiUrl + 'users/' + user.Username + '/favorites/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text'
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    } else {
      // Movie not found in favorites, no need to make the DELETE request
      return throwError("Movie not found in favorites");
    }
  }

  // endpoint

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  // Edit user endpoint

 editUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  
  // Verify if token exists
  if (!token) {
    return throwError("No token found in localStorage");
  }

  // Extract _id from userDetails
  const userId = userDetails._id;

  // Omit _id from userDetails to avoid sending it in the request body
  const { _id, ...updatedUserDetails } = userDetails;

  // Construct the API endpoint for updating the user
  const endpoint = `${apiUrl}users/${userId}`;

  // Make sure the request payload contains at least one valid field to update
  if (!('Username' in updatedUserDetails || 'Password' in updatedUserDetails || 'Email' in updatedUserDetails || 'Birthday' in updatedUserDetails || 'FavoriteMovies' in updatedUserDetails)) {
    return throwError("At least one valid field to update is required");
  }

  // Make the PUT request with updatedUserDetails
  return this.http.put(endpoint, updatedUserDetails, { 
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + token 
    }) 
  }).pipe(
    catchError(this.handleError)
  );
}


  // Delete user endpoint

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
  
    if (token) {
      return this.http.delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }
  
    console.error('No token provided');
    return throwError(() => new Error('No token provided'));
  }


// Non-typed response extraction
private extractResponseData(res: any): any {
  const body = res;
  return body || { };
}

private handleError(error: HttpErrorResponse): any {
  if (error.error instanceof ErrorEvent) {
  console.error('Some error occurred:', error.error.message);
  } else {
  console.error(
      `Error Status code ${error.status}, ` +
      `Error body is: ${error.error}`);
  }
  return throwError(() => new Error('Something bad happened; please try again later.'));
}
}