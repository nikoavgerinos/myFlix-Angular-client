
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
  