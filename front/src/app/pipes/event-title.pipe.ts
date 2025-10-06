import { Pipe, PipeTransform } from '@angular/core';
import { GameTextService } from '../services/core-game/game-text.service';
import { EventTitleKey } from '../types/text.type';

@Pipe({
  name: 'eventTitleKeyPipe',
  pure: false
})
export class EventTitleKeyPipe implements PipeTransform {
  constructor(private gameTextService: GameTextService) {}

  transform(key: EventTitleKey): string {
    return this.gameTextService.getEventTitle(key)
  }
}
