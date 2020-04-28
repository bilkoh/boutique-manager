import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, AlertMessage } from '@app/core/alert.service';

@Component({
    selector: 'alert-logger',
    template: `
        <div id="alertLogger" class="" style="position: fixed;bottom: 0px;right: 0px;">
            <div *ngIf="showPersistantLogs; then thenBlock else elseBlock"></div>
            <ng-template #thenBlock>
                <div class="alert mw-100 p-0" *ngFor="let alert of alerts">
                    <alert [type]="alert.type">{{ alert.message }}</alert>
                </div>
            </ng-template>
            <ng-template #elseBlock>
                <div class="alert mw-100 p-0" *ngFor="let alert of alerts">
                    <alert [type]="alert.type" dismissOnTimeout="{{timeout}}" class="mb-0">{{ alert.message }}</alert>
                </div>
            </ng-template>

            <div class="float-right .bg-light text-dark p-1">
                <span>
                    [ {{(alerts.length - 1)}} ]
                </span>
                <button type="button" class="btn btn-sm btn-dark" (click)="showPersistantLogs = !showPersistantLogs;">
                    <i class="fa {{showPersistantLogs ? 'fa-eye-slash' :'fa-eye'}}" aria-hidden="true"></i>
                    <div style="font-size: .5rem">{{showPersistantLogs ? 'hide' : 'show'}}</div>
                </button>
                <button type="button" class="btn btn-sm btn-danger" (click)="alerts = []">
                    <i class="fa fa-list" aria-hidden="true"></i>
                    <div style="font-size: .5rem">clear</div>
                </button>
                <!-- <div style="font-size: .5rem">Logger</div> -->
            </div>
        </div>
    `,
})
export class AlertLoggerComponent implements OnInit, OnDestroy {
    alerts: Array<AlertMessage> = [];
    showPersistantLogs = false;
    timeout = 3000;

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        // this.alerts.push( {type: 'primary', message: 'test'} );

        this.alertService.alertStatus.subscribe((val: AlertMessage) => {
            this.alerts.push( {type: val.type, message: val.message} );
            // console.log(this.alerts);
        });
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.alertService.alertStatus.unsubscribe();
    }
}
