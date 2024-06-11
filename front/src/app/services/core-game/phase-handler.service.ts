import { Injectable } from "@angular/core";
import { SelectablePhase, NonSelectablePhase } from "../../types/global.type";

interface PlayerPhase {
    playerId: number;
    currentSelectedPhase: SelectablePhase;
    previousSelectedPhase: SelectablePhase;
}
interface SelectedPhase {
    "development": boolean,
    "construction": boolean,
    "action": boolean,
    "production": boolean,
    "research": boolean
}
interface PhaseOrder {
    "0": NonSelectablePhase,
    "1": NonSelectablePhase,
    "2": NonSelectablePhase,
    "3": NonSelectablePhase,
    "4": NonSelectablePhase,
    "5": NonSelectablePhase,
}

const phaseCount = 5;

@Injectable({
    providedIn: 'root'
})
export class PhaseHandlerService {
    playerPhase: PlayerPhase[] = [];
    phaseIndex: number = 0;

    phaseOrder: PhaseOrder = {
        "0":"planification",
        "1":"development",
        "2":"construction",
        "3":"action",
        "4":"production",
        "5":"research"
    }
    selectedPhase: SelectedPhase = {
        "development": false,
        "construction": false,
        "action": false,
        "production": false,
        "research": false
    }
    addPlayer(playerId: number){
        var newPlayer: PlayerPhase;
        newPlayer = {
            "playerId": playerId,
            "currentSelectedPhase": undefined,
            "previousSelectedPhase": undefined
        }
        this.playerPhase.push(newPlayer)
    }
    /**
     * @param currentPhase as NonSelectablePhase
     * @returns next phase name
     * 
     * triggers all phase change and cleaning related stuff
     */
    goToNextPhase(currentPhase:NonSelectablePhase):NonSelectablePhase{
        var nextPhase: NonSelectablePhase;
        //start looping at phase index +1 or 1
        var startCounting: number = Math.max(this.phaseIndex + 1, 1)
        
        for(let i=startCounting; i<=phaseCount; i++){
            if(this.accessSelectedPhase(this.accessPhaseOrder(i))===true){
                nextPhase = this.accessPhaseOrder(i)
                this.setPhaseAsPlayed(currentPhase)
                return nextPhase
            }
        }

        //if no phase left selected to be played, restart to planification phase
        return this.phaseOrder["0"]
    }
    accessPhaseOrder(key: string | number): NonSelectablePhase{
        return this.phaseOrder[String(key) as keyof PhaseOrder]
    }
    accessSelectedPhase(key: string): boolean{
        return this.selectedPhase[key as keyof SelectedPhase]
    }
    setPhaseAsPlayed(phaseName: string){
        this.selectedPhase[phaseName as keyof SelectedPhase] = false
    }
    /**
     * 
     * @param playerId 
     * @param phase 
     * @returns 
     * sets up the phase selection for player
     * 
     * updates the global selectedPhase
     */
    playerSelectPhase(playerId:number, phase:SelectablePhase):void{
        if(phase===undefined){
            return
        }
        //player phase selection
        for(let i=0; i<this.playerPhase.length; i++){
            if(i===playerId){
                this.playerPhase[i].previousSelectedPhase = this.playerPhase[i].currentSelectedPhase
                this.playerPhase[i].currentSelectedPhase = phase
                break
            }
        }
        //global selectedPhase
        this.selectedPhase[phase]=true
        console.log('selectedPhase :')
        console.log(this.selectedPhase)
    }
}