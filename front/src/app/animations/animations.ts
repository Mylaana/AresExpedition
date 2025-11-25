import { trigger, transition, style, animate } from '@angular/animations';

export const expandCollapseVertical = trigger('expandCollapseVertical', [
	transition(':enter', [
	style({ height: '0px', overflow: 'hidden', opacity: 0 }),
	animate('150ms ease-out', style({ height: '*', opacity: 1 }))
	]),
	transition(':leave', [
	animate('150ms ease-in', style({ height: '0px', opacity: 0 }))
	])
])
export const expandCollapseHorizontal = trigger('expandCollapseHorizontal', [
	transition(':enter', [
	style({ width: '0px', opacity: 0 }),
	animate('300ms ease-out', style({ width: '*', opacity: 1 }))
	]),
	transition(':leave', [
	animate('300ms ease-in', style({ width: '0px', opacity: 0 }))
	])
])
export const enterFromLeft = trigger('enterFromLeft',[
	transition(':enter', [
		style({ left: '-100%', opacity: 1 }),
		animate('500ms ease-out', style({ left: '*', opacity: 1 }))
		]),
		transition(':leave', [
		animate('500ms ease-in', style({ left: '-100%', opacity: 1 }))
		])
])
export const enterFromRight = trigger('enterFromRight',[
	transition(':enter', [
		style({ left: '100%', opacity: 1 }),
		animate('500ms ease-out', style({ left: '*', opacity: 1 }))
		]),
		transition(':leave', [
		animate('500ms ease-in', style({ left: '100%', opacity: 1 }))
		])
])
export const fadeIn = trigger('fadeIn',[
	transition(':enter', [
		style({ opacity: 0 }),
		animate('300ms ease-out', style({ opacity: 1 }))
		]),
		transition(':leave', [
		animate('0ms ease-in', style({  opacity: 0 }))
		])
])
export const fadeInFadeOut = trigger('fadeInFadeOut',[
	transition(':enter', [
		style({ opacity: 0 }),
		animate('500ms ease-out', style({ opacity: 1 }))
		]),
		transition(':leave', [
		animate('300ms ease-in', style({  opacity: 0 }))
		])
])
export const fadeOut = trigger('fadeOut',[
	transition(':enter', [
		style({ opacity: 0 }),
		animate('100ms ease-out', style({ opacity: 1 }))
		]),
		transition(':leave', [
		animate('300ms ease-in', style({  opacity: 0 }))
		])
])