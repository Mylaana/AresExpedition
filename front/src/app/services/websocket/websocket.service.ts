import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import SockJS from 'sockjs-client';

export type ListenerCallBack = (message: Task) => void;
export interface Task {
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
    private connection: CompatClient | undefined = undefined;
    private subscription: StompSubscription | undefined;

    constructor() {
        // Utilisation de SockJS pour la connexion WebSocket
        this.connection = Stomp.over(() => new SockJS('http://localhost:8080/gs-guide-websocket'));
        this.connection.connect({}, () => {});
    }

    public send(task: Task): void {
        if (this.connection && this.connection.connected) {
            this.connection.send('/app/hello', {}, JSON.stringify(task));
        }
    }

    public listen(fun: ListenerCallBack): void {
        if (this.connection) {
            this.connection.connect({}, () => {
                this.subscription = this.connection!.subscribe('/topic/greetings', message => fun(JSON.parse(message.body)));
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
