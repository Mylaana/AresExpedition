import { Routes } from '@angular/router';
import { GameMainComponent } from './components/core/routes/game-main/game-main.component';
import { HomeComponent } from './components/core/routes/home/home.component';
import { CardOverviewComponent } from './components/core/routes/card-overview/card-overview.component';
import { CreateGameComponent } from './components/core/routes/create-game/create-game.component';
import { NewGameLinksComponent } from './components/core/routes/new-game-links/new-game-links.component';
import { ROUTE_CARD_OVERVIEW, ROUTE_CREATEGAME, ROUTE_GAME, ROUTE_NEWGAMELINKS } from './global/global-const';

export const routes: Routes = [
	{ path: '', component: HomeComponent},
	{ path: ROUTE_GAME, component: GameMainComponent},
	{ path: ROUTE_CARD_OVERVIEW, component: CardOverviewComponent},
	{ path: ROUTE_CREATEGAME, component: CreateGameComponent},
	{ path: ROUTE_NEWGAMELINKS, component: NewGameLinksComponent},
];
