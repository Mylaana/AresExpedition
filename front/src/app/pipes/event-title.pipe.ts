import { Pipe, PipeTransform } from '@angular/core';
import { GameTextService } from '../services/core-game/game-text.service';
import { EventTitleKey } from '../types/event.type';

@Pipe({
  name: 'eventTitleKeyPipe',
  pure: false // important : le pipe sera recalculé si la langue change
})
export class EventTitleKeyPipe implements PipeTransform {
  constructor(private gameTextService: GameTextService) {}

  transform(key: EventTitleKey): string {
    return this.gameTextService.getEventTitleRaw(key);
  }
}