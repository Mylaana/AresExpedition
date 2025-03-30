import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL_API_NEWGAME } from '../../global/global-const';
import { ApiMessage } from '../../interfaces/websocket.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}

  createGame(gameConfig: any): Observable<{ message: ApiMessage }> {
    return this.http.post<{ message: ApiMessage }>(GLOBAL_API_NEWGAME, gameConfig);
  }
}
