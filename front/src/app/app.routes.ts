import { Routes } from '@angular/router';
import { GameMainComponent } from './components/core/routes/game-main/game-main.component';

export const routes: Routes = [
	{ path: ':gameId/:playerId', component: GameMainComponent}
];
