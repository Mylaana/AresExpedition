import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import SockJS from 'sockjs-client';

export type ListenerCallBack = (message: Task) => void;
export interface Task {
    name: string;
}
export interface DrawQuery {
    drawNumber: number
}

export enum Message {
    drawQuery = 'DRAW_QUERY',
    other = 'OTHER'
}
interface PlayerMessage {
    gameId?: number,
    clientId?: number
    contentType: Message,
    content: any
}

const gameId = 1
const clientId = 0


@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
    private connection: CompatClient | undefined = undefined;
    private subscription: StompSubscription | undefined;
    private subscriptionGreetigns: StompSubscription | undefined;

    constructor() {
        // Utilisation de SockJS pour la connexion WebSocket
        this.connection = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
        this.connection.connect({}, () => {});
    }

    public send(message: PlayerMessage): void {
        if (this.connection && this.connection.connected) {
            message.clientId = clientId
            message.gameId = gameId
            this.connection.send('/app/player', {}, JSON.stringify(message));
        }
    }

    public listen(fun: ListenerCallBack): void {
        if (this.connection) {
            this.connection.connect({}, () => {
                this.subscription = this.connection!.subscribe(`/topic/player/${gameId}/${clientId}`, message => fun(JSON.parse(message.body)));
            });
            
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscriptionGreetigns?.unsubscribe();
        }
    }
}
