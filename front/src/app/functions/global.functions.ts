export function deepCopy(item: any): any{
	return JSON.parse(JSON.stringify(item))
}
