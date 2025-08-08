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

  createGame(gameConfig: any): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(GLOBAL_API_NEWGAME, gameConfig);
  }
}
