import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export class AlertMessage {
    public type: string;
    public message: string;
}

@Injectable()
export class AlertService {
    public alertStatus: BehaviorSubject<AlertMessage> = new BehaviorSubject<AlertMessage>({'type':'', 'message':''});

    showAlert(type: string, message: string) {
        type = type || 'warning';
        if (!message) {
            return;
        }
        
        const alertObj: AlertMessage = { type: type, message: message };
        this.alertStatus.next(alertObj);
    }
}