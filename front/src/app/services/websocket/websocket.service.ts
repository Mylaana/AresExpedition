import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import SockJS from 'sockjs-client';
import { WebsocketQueryMessageFactory } from '../designers/websocket-message-factory.service';
import { MessageContentQueryEnum, SubscriptionEnum } from '../../enum/websocket.enum';
import { WsInputMessage } from '../../interfaces/websocket.interface';
import { GLOBAL_CLIENT_ID, GLOBAL_GAME_ID } from '../../global/global-const';

type ListenerCallBack = (message: Task) => void;
export interface Task {
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
    private connection: CompatClient | undefined = undefined;
    private subscription: StompSubscription | undefined;
    private subscriptionGroup: StompSubscription | undefined;
    private reconnectDelay = 5000

    constructor() {
        this.connection = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
        this.connection.connect({}, () => {});
        this.connection.reconnectDelay = this.reconnectDelay
    }

    public sendDraw(drawNumber: number, eventId: number): void {
        this.sendMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId))
    }

    public sendReady(ready: boolean): void {
        this.sendMessage(WebsocketQueryMessageFactory.createReadyQuery(ready))
    }

    private sendMessage(message: any){
        if (this.connection && this.connection.connected) {
            this.connection.send('/app/player', {}, JSON.stringify(message));
            console.log("sending", message)
        }
    }

    public sendDebugMessage(param:{gameId?:number, playerId?:number, contentEnum:MessageContentQueryEnum, content:any}){
        let message = {
            gameId: param.gameId?? GLOBAL_GAME_ID,
            playerId: param.playerId?? GLOBAL_CLIENT_ID,
            contentEnum: param.contentEnum,
            content: param.content
        }
        console.log('debug message: ',message)
        this.sendMessage(message)
    }
    
    public listen(fun: ListenerCallBack): void {
        if (this.connection && this.connection.connected) {
            this.subscriptionGroup = this.connection.subscribe(`/topic/group/${GLOBAL_GAME_ID}`, message => {
                fun(this.addSubscriptionType(message.body, SubscriptionEnum.group));
            });
            this.subscription = this.connection.subscribe(`/topic/player/${GLOBAL_GAME_ID}/${GLOBAL_CLIENT_ID}`, message => {
                fun(this.addSubscriptionType(message.body, SubscriptionEnum.player));
            });

        } else {
            this.connection?.connect({}, () => {
                this.subscriptionGroup = this.connection!.subscribe(`/topic/group/${GLOBAL_GAME_ID}`, message => {
                    fun(this.addSubscriptionType(message.body, SubscriptionEnum.group));
                });
                this.subscription = this.connection!.subscribe(`/topic/player/${GLOBAL_GAME_ID}/${GLOBAL_CLIENT_ID}`, message => {
                    fun(this.addSubscriptionType(message.body, SubscriptionEnum.player));
                });

            });
        }
    }

    private addSubscriptionType(messageBody: any, subscription: SubscriptionEnum): any {
        let result: WsInputMessage = {
            subscription:subscription,
            message: JSON.parse(messageBody)
        }
        return result
    }
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.subscriptionGroup) {
            this.subscriptionGroup.unsubscribe();
        }
        if (this.connection) {
            this.connection.disconnect(() => {
                console.log('Déconnexion du WebSocket');
            });
        }
    }
}
