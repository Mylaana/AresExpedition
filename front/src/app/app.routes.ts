import { Routes } from '@angular/router';
import { GameMainComponent } from './components/core/routes/game-main/game-main.component';
import { HomeComponent } from './components/core/routes/home/home.component';
import { CardOverviewComponent } from './components/core/routes/card-overview/card-overview.component';
import { NewGameComponent } from './components/core/routes/new-game/new-game.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent},
	{ path: ':gameId/:playerId', component: GameMainComponent},
	{ path: 'card-overview', component: CardOverviewComponent},
	{ path: 'new-game', component: NewGameComponent},
];
