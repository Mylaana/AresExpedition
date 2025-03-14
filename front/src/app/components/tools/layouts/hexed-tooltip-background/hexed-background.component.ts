import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-hexed-background',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './hexed-background.component.html',
	styleUrl: './hexed-background.component.scss'
})
export class HexedBackgroundComponent implements OnInit {
	@Input() row: number = 7;  // Nombre d'hexagones en hauteur
	@Input() column: number = 15; // Nombre d'hexagones en largeur
	@Input() background: boolean = false

	_rowArray: number[] = [];
	_columnArray: number[] = [];

	constructor(private elRef: ElementRef) {}

	ngOnInit(): void {
		const ne = this.elRef.nativeElement;

		const realColumns = 1 * this.column;
		const realRows = 2 * this.row;

		this._columnArray = Array.from({ length: this.column }, (_, i) => i);
		this._rowArray = Array.from({ length: this.row }, (_, i) => i);
		const carr = this._columnArray.map((v) => `'${v}':${v}`).join(',');

		ne.style.setProperty('--row', `${realRows}`);
		ne.style.setProperty('--column', `${realColumns}`);
		ne.style.setProperty('--row-array', `${this._rowArray}`);
		ne.style.setProperty('--column-array', `${this._columnArray}`);
		ne.style.setProperty('--carr', `(${carr})`);



		//Generate CSS class
		let styles = '';

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
			`;
		});

		this._rowArray.forEach((r) => {
			styles += `
			.r${r}.even {
				grid-row-start: ${r * 2 + 1};
				grid-row-end: ${r * 2 + 3};
			}
			.r${r}.odd {
				grid-row-start: ${r * 2 + 2};
				grid-row-end: ${r * 2 + 4};
			}
			`;
		});

		const styleSheet = document.createElement('style');
		//styleSheet.type = 'text/css';
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
	}
}
