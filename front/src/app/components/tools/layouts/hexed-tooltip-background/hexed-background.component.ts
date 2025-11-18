import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, timeout } from 'rxjs';
import { fromEvent, debounceTime } from 'rxjs';
import { HexSize } from '../../../../types/global.type';

type PartialStyle = 'none' | 'phaseBase' | 'phaseUpgraded' | 'sellEvent'
const ratioWidthToHeight: number = .88

const hexWidth = new Map<HexSize, number>([
	["xs", 17],
	["small", 22],
	["medium", 35],
	["large", 50],
])

@Component({
    selector: 'app-hexed-background',
    imports: [CommonModule],
    templateUrl: './hexed-background.component.html',
    styleUrl: './hexed-background.component.scss'
})
export class HexedBackgroundComponent implements OnDestroy, AfterViewInit {
	@Input() row: number = 1; //forced number of rows
	@Input() column: number = 1; //forced number of columns
	@Input() background: boolean = false
	@Input() autoFillHexSize!: HexSize
	@Input() partialStyle: PartialStyle = 'none'

	_rowNumber!: number
	_columnNumber!: number
	_rowArray: number[] = [];
	_columnArray: number[] = [];
	
	private loaded = false
	private destroy$ = new Subject<void>()

	constructor(private elRef: ElementRef) {
		fromEvent(window, 'resize').pipe(takeUntil(this.destroy$), debounceTime(5)).subscribe(() => {this.refreshHexNumbers()});
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	ngAfterViewInit(): void {
		this.refreshHexNumbers()
		this.loaded = true
		setTimeout(() => this.refreshHexNumbers(), 10);
	}
	getHexWidth(width: HexSize): number {
		let result = hexWidth.get(width)
		return result??1
	}
	refreshHexNumbers(){
		if(!this.loaded){return}
		if(!this.autoFillHexSize){
			this._columnNumber = this.column
			this._rowNumber = this.row
		} else {
			let width = this.getHexWidth(this.autoFillHexSize)
			this._columnNumber = Math.floor(this.elRef.nativeElement.offsetWidth / width)
			this._rowNumber = Math.floor(this.elRef.nativeElement.offsetHeight / width * ratioWidthToHeight)
		}

		const ne = this.elRef.nativeElement

		const realColumns = 1 * this._columnNumber
		const realRows = 2 * this._rowNumber

		this._columnArray = Array.from({ length: this._columnNumber }, (_, i) => i)
		this._rowArray = Array.from({ length: this._rowNumber }, (_, i) => i)
		const carr = this._columnArray.map((v) => `'${v}':${v}`).join(',')

		ne.style.setProperty('--row', `${realRows}`)
		ne.style.setProperty('--column', `${realColumns}`)
		ne.style.setProperty('--row-array', `${this._rowArray}`)
		ne.style.setProperty('--column-array', `${this._columnArray}`)
		ne.style.setProperty('--carr', `(${carr})`)

		//Generate CSS class
		let styles = ''
		let index = 0

		this._columnArray.forEach((c) => {
			styles += `
			.c${c}.even {
				grid-column-start: ${c * 2 + 1};
				grid-column-end: ${c * 2 + 4};
			}
			.c${c}.odd {
				grid-column-start: ${(c - 1) * 2 + 3};
				grid-column-end: ${(c - 1) * 2 + 6};
			}
			`
		});

		index = 0
		this._rowArray.forEach((r) => {
			index += 1
				styles += `
				.r${r}.even {
					grid-row-start: ${r * 2 + 1};
					grid-row-end: ${r * 2 + 3};
				}
				.r${r}.odd {
					grid-row-start: ${r * 2 + 2};
					grid-row-end: ${r * 2 + 4};
				}
				`
		})
		const styleSheet = document.createElement('style')
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet)
	}
	display(c: number, r: number): boolean {
		if(this.partialStyle==='none'){return true}
		if(['phaseBase', 'phaseUpgraded'].includes(this.partialStyle)){return this.displayPhaseStyle(c, r)}
		if(this.partialStyle==='sellEvent'){return this.displayOtherStyle(c, r)}
		return false
	}
	private displayPhaseStyle(c: number, r: number): boolean {
		let step1 = ((r%2===0 && c%3===0) || (r%3===0 && c%2===0)) &&c!=r || c===(r+2)
		let step3 = c===(r+1) || c===(r-4) || c===(r+3) || c===(r-1)

		if(this.partialStyle==='phaseBase'){return step1}
		if(this.partialStyle==='phaseUpgraded'){return step3  || step1}

		return false
	}
	private displayOtherStyle(c: number, r: number): boolean {
		return c%(r+5)===0 || r%c===0 || c%(r+2)===0 || r%9===0|| r%8===0 || (c%9===0 && r%4===0) || (c%8===0 && r%3===0)
	}
}
