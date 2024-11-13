import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import SockJS from 'sockjs-client';
import { WebsocketQueryDesigner } from '../designers/websocket-query-designer.service';

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

const gameId = 1
const clientId = 0


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

    public sendDraw(drawNumber: number): void {
        if (this.connection && this.connection.connected) {
            let message = WebsocketQueryDesigner.createDrawQuery(drawNumber)
            this.connection.send('/app/player', {}, JSON.stringify(message));
        }
    }

    public listen(fun: ListenerCallBack): void {
        if (this.connection && this.connection.connected) {
            this.subscription = this.connection.subscribe(`/topic/player/${gameId}/${clientId}`, message => {
                fun(JSON.parse(message.body));
            });
            this.subscriptionGroup = this.connection.subscribe(`/topic/group/${gameId}`, message => {
                fun(JSON.parse(message.body));
            });
        } else {
            this.connection?.connect({}, () => {
                this.subscription = this.connection!.subscribe(`/topic/player/${gameId}/${clientId}`, message => {
                    fun(JSON.parse(message.body));
                });
                this.subscriptionGroup = this.connection!.subscribe(`/topic/group/${gameId}`, message => {
                    fun(JSON.parse(message.body));
                });
            });
        }
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
