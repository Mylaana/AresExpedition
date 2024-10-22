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
}