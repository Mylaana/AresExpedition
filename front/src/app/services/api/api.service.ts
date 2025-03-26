import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL_API_NEWGAME } from '../../global/global-const';

interface ApiResponseMessage {
	links: string[],
	options?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}

  createGame(gameConfig: any): Observable<{ message: ApiResponseMessage }> {
    return this.http.post<{ message: ApiResponseMessage }>(GLOBAL_API_NEWGAME, gameConfig);
  }
}
