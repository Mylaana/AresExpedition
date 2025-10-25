import { Injectable } from "@angular/core";

@Injectable()
export class StatService {
	rawStats: any
	initialize(stats: any){
		this.rawStats = stats
	}
	getData(name: string): string {
		if(!this.rawStats){return ''}
		if(!this.rawStats[name]){return 'cannot find '+ name}
		return this.rawStats[name]
	}
}
