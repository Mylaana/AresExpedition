import { trigger, transition, style, animate } from '@angular/animations';

export const expandCollapseVertical = trigger('expandCollapseVertical', [
	transition(':enter', [
	style({ height: '0px', overflow: 'hidden', opacity: 0 }), // Départ
	animate('150ms ease-out', style({ height: '*', opacity: 1 })) // Arrivée
	]),
	transition(':leave', [
	animate('150ms ease-in', style({ height: '0px', opacity: 0 })) // Disparition
	])
])

export const expandCollapseHorizontal = trigger('expandCollapseHorizontal', [
	transition(':enter', [
	style({ width: '0px', opacity: 0 }), // Départ
	animate('300ms ease-out', style({ width: '*', opacity: 1 })) // Arrivée
	]),
	transition(':leave', [
	animate('300ms ease-in', style({ width: '0px', opacity: 0 })) // Disparition
	])
])

export const enterFromLeft = trigger('enterFromLeft',[
	transition(':enter', [
		style({ left: '-100%', opacity: 1 }), // Départ
		animate('500ms ease-out', style({ left: '*', opacity: 1 })) // Arrivée
		]),
		transition(':leave', [
		animate('500ms ease-in', style({ left: '-100%', opacity: 1 })) // Disparition
		])
])
