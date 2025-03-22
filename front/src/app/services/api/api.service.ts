import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL_API_NEWGAME } from '../../global/global-const';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}

  createGame(gameConfig: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(GLOBAL_API_NEWGAME, gameConfig);
  }
}
