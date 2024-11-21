import { Component, OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { SelectablePhase } from '../../../types/global.type';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { DrawEvent, EventBaseModel } from '../../../models/core-game/event.model';
import { MessageContentQueryEnum } from '../../../enum/websocket.enum';
import { Subscription } from 'rxjs';
import { RxStompService } from '../../../services/websocket/rx-stomp.service';
import { WsInputMessage } from '../../../interfaces/websocket.interface';
import { WebsocketQueryMessageFactory } from '../../../services/designers/websocket-message-factory.service';
import { Message } from '@stomp/stompjs';
import { rxStompServiceFactory } from '../../../services/websocket/rx-stomp-service-factory';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
  selector: 'app-server-emulation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './server-emulation.component.html',
  styleUrl: './server-emulation.component.scss',
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
})
export class ServerEmulationComponent implements OnInit, AfterViewInit {
  debug: boolean = true;
  currentGroupPlayerState!: {};
  currentEventQueue: EventBaseModel[] = [];
  currentPhase: string = "planification";
  currentDrawQueue: DrawEvent[] = []
  cardsDeck: number[] = [];
  cardsDiscarded: number[] = [];
  phaseList: SelectablePhase[] = ["development","construction","action","production","research"]
  authorizedBotPhaseSelection: SelectablePhase[] = ["development","construction","action","production","research"]

  //@ts-ignore
  private groupSubscription: Subscription;
  //@ts-ignore
  private playerSubscription: Subscription;

  constructor(private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService,
    private rxStompService: RxStompService
  ){}


  ngOnInit(){
    this.cardsDeck = this.cardInfoService.getProjectCardIdList()

    this.gameStateService.addPlayer("joueur 1", "rgb(0, 0, 255)")
    this.gameStateService.addPlayer("joueur 2", "rgb(255, 0, 0)")
    this.gameStateService.addPlayer("joueur 3", "rgb(0, 255, 0)")
    this.gameStateService.addPlayer("joueur 4", "rgb(255, 255, 255)")

    this.gameStateService.currentPhase.subscribe(
      phase => this.phaseChanged(phase)
    )
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.currentGroupPlayerState = groupPlayerState
    )
    this.gameStateService.currentDrawQueue.subscribe(
      //drawQueue => this.handleDrawQueueRequest(drawQueue)
    )
    this.gameStateService.currentLoadingState.subscribe(
      loading => this.loadingFinished(loading)
    )
    this.gameStateService.currentEventQueue.subscribe( 
      event => this.currentEventQueue = event
    )


    this.groupSubscription = this.rxStompService
    .watch('/topic/group/1')
    .subscribe((message: Message) => {
      console.log(message.body)
    });
    this.playerSubscription = this.rxStompService
    .watch('/topic/player')
    .subscribe((message: Message) => {
      console.log(message.body)
    });
    /*
    this.rxStompService.connected$.subscribe((connected) => {
      console.log('WebSocket connected: ', connected);
    });
    const rxStomp = rxStompServiceFactory();
    console.log('Is connected? ', rxStomp.active);
    */
    return
    //force draw card list for debug purpose
    let cardDrawList: number[] = [263, 36, 222, 81, 123, 204, 141]
    //force phase selection pool
    this.authorizedBotPhaseSelection = ['development']

    this.gameStateService.addCardToPlayerHand(this.gameStateService.clientPlayerId, cardDrawList)
  }

  ngAfterViewInit(): void {
    this.gameStateService.setPlayerIdList([0,1,2,3])
  }

  phaseChanged(phase: Phase){
    if(this.gameStateService.loading.getValue()===true){return}
    this.currentPhase = phase

  }

  updatePhase(newPhase:Phase): void {
    //sends phase update to service's behaviorSubject
    this.gameStateService.updatePhase(newPhase)

    let phaseList = this.phaseList
    let randomPhase = phaseList[Math.floor(Math.random() * phaseList.length)]
    this.gameStateService.playerSelectPhase(1, randomPhase as keyof SelectablePhase)
    //this.gameStateService.setClientPlayerReady(true, 1)
  }

  printPlayersState(): void {
    console.log(this.currentGroupPlayerState)
    console.log(this.gameStateService.groupPlayerReady.getValue())
  }

/*
  handleDrawQueueRequest(drawQueue: DrawEvent[]):void{

    this.currentDrawQueue = drawQueue

    if(drawQueue.length===0){
      return
    }
    let currentDrawEvent = drawQueue[0]
    if(currentDrawEvent.finalized===true || currentDrawEvent.served===true){return}
    if(this.cardsDeck.length===0){
      console.log('no cards left in deck')
      currentDrawEvent.finalized = true
      this.gameStateService.cleanAndNextDrawQueue()
      return
    }

    currentDrawEvent.served=true
    currentDrawEvent.drawResultCardList = this.drawCardFromDeck(currentDrawEvent.drawCardNumber)
    this.gameStateService.cleanAndNextDrawQueue()
  }
  */
  drawCardFromDeck(drawNumber?: number): number[]{
    var resultList: number[] = [];

    if(drawNumber===undefined){
      drawNumber=1
    }
    for(let i=0; i<drawNumber; i++){
      if(this.cardsDeck.length===0){
        //no more cards in deck, need to add reshuffle
        return []
      }
      let index = Math.floor(Math.random()*this.cardsDeck.length);
      resultList.push(this.cardsDeck[index])
      this.cardsDeck.splice(index, 1)
    }
    return resultList
  }
  loadingFinished(loading: boolean):void{
    if(loading===true){return}
  }
  sendDrawNumber(): void {
    //this.websocket.sendDraw(2, -1)
  }
  sendReady(): void {
    //this.websocket.sendReady(true)
    let message = JSON.stringify(WebsocketQueryMessageFactory.createReadyQuery(true))
    this.rxStompService.publish({ destination: '/app/player', body: message });
  }
  sendNotReady(): void {
    let message = JSON.stringify(WebsocketQueryMessageFactory.createReadyQuery(false))
    this.rxStompService.publish({ destination: '/app/player', body: message });
    //this.websocket.sendReady(false)
  }
  sendtest(): void {
    let message = JSON.stringify("test")
    this.rxStompService.publish({ destination: '/app/test', body: message });
    //this.websocket.sendReady(false)
  }
  sendBotsReady(): void {
    for(let index of this.gameStateService.playerCount.getValue()){
      if(index===this.gameStateService.clientPlayerId){continue}
      this.botIdReady(index)
    }
  }
  botIdReady(id: number){
    //this.websocket.sendDebugMessage({gameId:1,playerId:id,contentEnum:MessageContentQueryEnum.ready,content:{ready:true}})
  }
  printEventQueue(): void {
    console.log(this.gameStateService.eventQueue.getValue())
  }
  printDrawQueue(): void {
    console.log(this.gameStateService.drawQueue.getValue())
  }
}
