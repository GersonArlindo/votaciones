import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HandlerErrorService } from './handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private HandlerErrorSrv: HandlerErrorService
  ) { }

  login(authData: any):Observable<any | void> {
    return this.http
    .post<any>(`${environment.API_URL}auth/login`, authData)
    .pipe(
      map((res: any) =>{
        //save token
        this.saveToken(res.access_token);
        return res;
      }),
      catchError((err: HttpErrorResponse) => this.handlerError(err))
    );
  }

  private saveToken(token:string):void{
    localStorage.setItem('login-token', token);
  }

  private handlerError(err: { message: any; }): Observable<never> {
    let errorMessage = 'An errror occured retrienving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    return throwError(errorMessage);
  }

}
