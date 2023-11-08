import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerErrorService } from './handler-error.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PersonaNaturalService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private HandlerErrorSrv: HandlerErrorService
  ) {}

  getPersonaNatural(): Observable<any[]> {
    return this.http.get<any>(`${environment.API_URL}persona-natural`).pipe(
      map((response: any) => response),
      catchError((err: any) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  getPersonaNaturalById(id: any): Observable<any[]> {
    return this.http
      .get<any>(`${environment.API_URL}persona-natural/${id}`)
      .pipe(map((response: any) => response));
  }

  
}
