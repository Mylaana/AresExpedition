import { DEBUG_LOG_EVENT_RESOLUTION, DEBUG_LOG_WS_PUBLISH, DEBUG_LOG_WS_RECEIVED, GLOBAL_CLIENT_ID } from "../global/global-const"
import { MinMaxEqualTreshold } from "../interfaces/global.interface"

export class Utils {
	public static jsonCopy(item: any): any{
		return JSON.parse(JSON.stringify(item))
	}
	/**
	 *
	 * @param treshold
	 * @param value
	 * @param tresholdType
	 * @returns boolean  
	 * returns true if value is in treshold limit
	 */
	public static getValueVsTreshold(args: MinMaxEqualTreshold): boolean {
		switch(args.treshold){
			case('equal'):{
				return args.value === args.tresholdValue
			}
			case('min'): {
				return  args.value >= args.tresholdValue
			}
			case('max'): {
				return  args.value <= args.tresholdValue
			}
		}
	}
	public static logText(...text: any ): void {
		console.log(text)
	}
	public static logEventResolution(...text: any): void {
		if(!DEBUG_LOG_EVENT_RESOLUTION){return}
		this.logText(text)
	}
	public static logError(...text: any): void{
		console.log(text)
	}
	public static logPublishMessage(prefix: any, content: any): void {
		if(!DEBUG_LOG_WS_PUBLISH){return}
		console.log(`%cPUBLISHED: ${prefix}: `, 'color:red', content)
	}
	public static logReceivedMessage(prefix: any, content: any): void {
		if(!DEBUG_LOG_WS_RECEIVED){return}
		console.log(`%cRECEIVED: ${prefix}: `, 'color:green', content)
	}
}