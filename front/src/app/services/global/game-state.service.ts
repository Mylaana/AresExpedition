import { Injectable } from "@angular/core";
import { GameEventComponent } from "../../game-event/game-event.component";
import { BehaviorSubject } from "rxjs";

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Injectable({
    providedIn: 'root'
})
export class GameState {
    phase: Phase = 'planification'
    gameEvent!: GameEventComponent;
    
    setNewPhase(newPhase:Phase): void {
        //triggers phase change to emulate server response
        this.phase = newPhase
      }
    getPhase(): Phase {
        return this.phase
    }
}
