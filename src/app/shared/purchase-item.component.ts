import { Component, Input, OnInit } from '@angular/core';
import { Purchase, Frame } from '@app/types';
import { Apollo } from 'apollo-angular';
import { AlertService, AlertMessage } from '@app/core/alert.service';

import gql from 'graphql-tag';

@Component({
  selector: 'bm-purchase-item',
  template: `
    <div class="card purchaseItemComponent mb-4">
      <div class="card-header">
        Purchase
        <span *ngIf="isNew" class="badge badge-info float-right">* New Purchase. Yet to be added.</span>
      </div>
      <div class="card-body">
        <form>
          <div class="form-row">
            <div class="form-group col">
              <label>Price sold to Patient</label>
              <div class="input-group">
                <span class="input-group-addon">$</span>
                <input [(ngModel)]='p.price' type="text" class="form-control currency" name="price" >
              </div>
            </div>

            <div class="form-group col">
              <label>Patient Purchaser:</label>

              <!-- selector component -->
              <bm-patient-purchaser-select
                [selectedPatientId]="p.patient.id"
                (onPatientSelect)="onPatientSelect($event)">
              </bm-patient-purchaser-select>

            </div>
            <div class="form-group col">
              <label>Date Sold:</label>
              <input [(ngModel)]='p.dateSold' type="date" class="form-control" name="dateSold">
            </div>
          </div>

          <div class="row"><div class="col">
            <hr>
            Purchased Frame Information:
          </div></div>

          <div class="form-row">
            <div class="form-group col">
              <label>Brand</label>
              <input [(ngModel)]='p.frame.brand' readonly type="text" class="form-control" name="brand">
            </div>
            <div class="form-group col">
              <label>Model</label>
              <input [(ngModel)]='p.frame.model' readonly type="text" class="form-control" name="model">
            </div>
            <div class="form-group col">
              <label>Color Code</label>
              <input [(ngModel)]='p.frame.colorCode' readonly type="text" class="form-control" name="colorCode">
            </div>
            <div class="form-group col">
              <label>Color Name</label>
              <input [(ngModel)]='p.frame.colorName' readonly type="text" class="form-control" name="colorName">
            </div>
            <div class="form-group col">
              <label>Wholesale Price:</label>
              <input [(ngModel)]='p.frame.wholesalePrice' readonly type="text" class="form-control" name="wholesalePrice">
            </div>
            <div class="form-group col">
              <label>Retail Price:</label>
              <input [(ngModel)]='p.frame.retailPrice' readonly type="text" class="form-control" name="retailPrice">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" (click)="onSubmit()"> {{isNew ? 'Add' : 'Save'}} Purchase</button>
          <button *ngIf="!isNew" type="button" class="btn btn-outline-danger" (click)="onDelete()">Delete</button>

        </form>
      </div>
    </div>
  `,
})
export class PurchaseItemComponent implements OnInit {
  @Input() purchase: Purchase;
  @Input() frame: Frame;
  p: Purchase;
  isNew: boolean = false;

  constructor(private apollo: Apollo, private alertService: AlertService) { }

  ngOnInit() {
    if (!this.purchase) {
      // purchase object not passed, must make a fresh one
      console.log('purchase object not passed, must make a fresh one')
      this.p = {
        patient: {},
        frame: this.frame || {},
      } as Purchase;

      this.p.dateSold = new Date(Date.now()).toISOString().slice(0, 10);
      this.isNew = true;
    } else {
      console.log('working with purchase object input')
      // working with purchase object input
      // must remove reference to work with ngModel (or something)
      // this.p = Object.assign({}, this.purchase) as Purchase;
      this.p = JSON.parse(JSON.stringify(this.purchase));
      this.p.dateSold = new Date(this.p.dateSold).toISOString().slice(0, 10);
    }

  }

  onPatientSelect(id) {
    this.p.patient.id = id;
    console.log('onPatientSelect', this.p.patient.id);
  }

  onSubmit() {
    if (!this.p.patient.id) {
      this.alertService.showAlert('danger', 'No Patient selected!');
      return;
    }
    if (!this.p.price) {
      this.alertService.showAlert('danger', 'No Price set!');
      return;
    }
    if (!this.p.dateSold) {
      this.p.dateSold = new Date(Date.now()).toISOString().slice(0, 10);
    }

    if (this.isNew) {
      // console.log(this.p);
      // return;
      // create mutation
      this.apollo.mutate({
        mutation: gql`
          mutation CreatePurchaseSelection ($dateSold: DateTime!, $price: Float!, $frameId: ID!, $patientId: ID!) {
            createPurchase(
              dateSold: $dateSold,
              price: $price,
              frameId: $frameId,
              patientId: $patientId,
            ) {
              id
            }
          }
        `,
        variables: {
          dateSold: this.p.dateSold,
          price: +this.p.price,
          frameId: this.p.frame.id,
          patientId: this.p.patient.id,
        }
      }).subscribe((res) => {
        const returnFrame = res.data.createPurchase;
        console.log('createPurchase ', JSON.stringify(returnFrame))
        this.alertService.showAlert('success', 'Purchase has been created.');

        // if this was saved we should have an id in returnFrame
        // no longer consider "new" (not from database)
        this.p = Object.assign(this.p, JSON.parse(JSON.stringify(returnFrame))) as Purchase;
        this.isNew = false;
      });
    } else {
      // update mutation
      this.apollo.mutate({
        mutation: gql`
          mutation UpdatePurchaseSelection ($id: ID!, $dateSold: DateTime!, $price: Float!, $frameId: ID!, $patientId: ID!) {
            updatePurchase(
              id: $id,
              dateSold: $dateSold,
              price: $price,
              frameId: $frameId,
              patientId: $patientId,
            ) {
              id
            }
          }
        `,
        variables: {
          id: this.p.id,
          dateSold: this.p.dateSold,
          price: +this.p.price,
          frameId: this.p.frame.id,
          patientId: this.p.patient.id,
        }
      }).subscribe((res) => {
        console.log('res:', res);

        console.log('updatePurchase ', JSON.stringify(res.data.updatePurchase))
        this.alertService.showAlert('success', 'Purchase has been updated.');
      });
    }
  }

  onDelete() {
    console.log('id!:', this.p);
    this.apollo.mutate({
    mutation: gql`
        mutation deletePurchaseMutation ($id: ID!) {
            deletePurchase(id: $id) {
                id
            }
        }
    `,
    variables: {
        id: this.p.id // id
    }
    }).subscribe((res) => {
        const id = res.data.deletePurchase.id;
        this.alertService.showAlert('primary', 'Deleted ' + id);
    });
  }

}
