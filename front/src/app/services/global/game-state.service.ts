import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Injectable({
    providedIn: 'root'
})
export class GameState {
    constructor(){}

    phase = new BehaviorSubject("planification")

    currentPhase = this.phase.asObservable();
    
    updatePhase(newPhase: Phase): void {
        //triggers phase change to emulate server response
        this.phase.next(String(newPhase))
    }
    getPhase(): string {
        return this.phase.value
    }
}
