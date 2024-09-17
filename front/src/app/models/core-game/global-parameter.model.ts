import { GlobalParameter } from "../../interfaces/global.interface";
import { GlobalParameterName } from "../../types/global.type";

export class GlobalParameterModel {
    readonly globalParameterIndex = new Map<GlobalParameterName, number>(
        [
            ['infrastructure', 0],
            ['ocean', 1],
            ['oxygen', 2],
            ['temperature', 3],
        ]
    )
    readonly parameters: GlobalParameter[] = [
            {name: 'infrastructure',value: 0, addEndOfPhase: 0},
            {name: 'ocean',value: 0,addEndOfPhase: 0},
            {name: 'oxygen',value: 0,addEndOfPhase: 0},
            {name: 'temperature',value: 0,addEndOfPhase: 0}
        ]
    getGlobalParameterIndex(parameter: GlobalParameterName): number | undefined {
        for(let i=0; i<this.parameters.length; i++){
            if(this.parameters[i].name===parameter){return i}
        }

        return undefined
    }
    addStepToParameterEOP(parameter: GlobalParameterName, steps: number): void {
        let parameterIndex = this.getGlobalParameterIndex(parameter)
        if(parameterIndex===undefined){return}

        if(this.parameters[parameterIndex].addEndOfPhase===undefined){
            this.parameters[parameterIndex].addEndOfPhase=steps
            return
        }
        this.parameters[parameterIndex].addEndOfPhase += steps
    }
}

