import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Frame } from '@app/types';

import { AlertService, AlertMessage } from '@app/core/alert.service';

import { UPDATE_FRAME_MUTATION, CREATE_FRAME_MUTATION, GET_LAST_FRAME_QUERY } from '@app/graphql';
import gql from 'graphql-tag';

@Component({
  selector: 'bm-frame-item',
  template: `
    <div class="card frameItemComponent mb-4">
      <div class="card-header">
        Frame
        <span *ngIf="isNew" class="badge badge-info float-right">* New frame. Yet to be added.</span>
      </div>
      <div class="card-body">

        <form>
          <div class="form-row">
            <div class="form-group col">
              <label for="distributor">Distributor</label>
              <input [(ngModel)]='f.distributor' type="text" class="form-control" name="distributor" placeholder="eg: UltraPalm">
            </div>
            <div class="form-group col">
              <label for="brand">Brand</label>
              <input [(ngModel)]='f.brand' type="text" class="form-control" name="brand" placeholder="eg: Cazal">
            </div>
            <div class="form-group col">
              <label for="model">Model</label>
              <input [(ngModel)]='f.model' type="text" class="form-control" name="model" placeholder="eg: 672">
            </div>
          </div>
          <div class="form-row">
              <div class="form-group col-md-4">
                  <label for="colorCode">Color Code</label>
                  <input [(ngModel)]='f.colorCode' type="text" class="form-control" name="colorCode" placeholder="eg: 001">
                </div>
                <div class="form-group col-md-4">
                  <label for="colorName">Color Name</label>
                  <input [(ngModel)]='f.colorName' type="text" class="form-control" name="colorName" placeholder="eg: Black Gold">
                </div>
                <div class="form-group col-md-1">
                  <label for="sizeA">A</label>
                  <input [(ngModel)]='f.sizeA' type="text" class="form-control" name="sizeA" placeholder="eg: 50">
                </div>
                <div class="form-group col-md-1">
                  <label for="sizeDBL">DBL</label>
                  <input [(ngModel)]='f.sizeDBL' type="text" class="form-control" name="sizeDBL" placeholder="eg: 20">
                </div>
                <div class="form-group col-md-1">
                  <label for="sizeB">B</label>
                  <input [(ngModel)]='f.sizeB' type="text" class="form-control" name="sizeB" placeholder="eg: 38">
                </div>
                <div class="form-group col-md-1">
                  <label for="sizeTemple">Temple</label>
                  <input [(ngModel)]='f.sizeTemple' type="text" class="form-control" name="sizeTemple" placeholder="eg: 135">
                </div>
          </div>
          <div class="form-row">
            <div class="form-group form-check col">
              <label class="form-check-label" for="isSun">
                <input [(ngModel)]='f.isSun' class="form-check-input" name="isSun" type="checkbox" value="">
                Sunglass?
              </label>
            </div>
            <div class="form-group form-check col">
              <label class="form-check-label" for="isPolarized">
                <input [(ngModel)]='f.isPolarized' class="form-check-input" name="isPolarized" type="checkbox" value="">
                Polarized?
              </label>
            </div>
            <div class="form-group form-check col">
              <label class="form-check-label" for="isDrillmount">
                <input [(ngModel)]='f.isDrillmount' class="form-check-input" name="isDrillmount" type="checkbox" value="">
                Drillmount?
              </label>
            </div>
            <div class="form-group form-check col">
              <label class="form-check-label" for="isCloseout">
                <input [(ngModel)]='f.isCloseout' class="form-check-input" name="isCloseout" type="checkbox" value="">
                Closeout?
              </label>
            </div>
          </div>
          <hr>
          <div class="form-row">
            <div class="form-group col">
              <label for="dateReceived">Date Received</label>
              <input [(ngModel)]='f.dateReceived' type="date" class="form-control" name="dateReceived">
            </div>
            <div class="form-group col">
              <label for="wholesalePrice">Wholesale</label>
              <div class="input-group">
                <span class="input-group-addon">$</span>
                <input [(ngModel)]='f.wholesalePrice' type="text" class="form-control currency" name="wholesalePrice" placeholder="eg: 200">
              </div>
            </div>
            <div class="form-group col">
              <label for="retailPrice">Retail</label>
              <div class="input-group">
                <span class="input-group-addon">$</span>
                <input [(ngModel)]='f.retailPrice' type="text" class="form-control currency" name="retailPrice" placeholder="eg: 600">
              </div>
            </div>
            <div class="form-group col">
              <label>Set Retail by Multiplier</label>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary btn-sm" (click)="retailMultiplier(2)">2.0x</button>
                <button type="button" class="btn btn-secondary btn-sm" (click)="retailMultiplier(2.5)">2.5x</button>
                <button type="button" class="btn btn-secondary btn-sm" (click)="retailMultiplier(2.8)">2.8x</button>
                <button type="button" class="btn btn-secondary btn-sm" (click)="retailMultiplier(3)">3.0x</button>
              </div>
            </div>
            <div class="form-group col">
              <label for="minRetailPrice">Minimum Retail</label>
              <div class="input-group">
                <span class="input-group-addon">$</span>
                <input [(ngModel)]='f.minRetailPrice' type="text" class="form-control currency" name="minRetailPrice" placeholder="eg: 0">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-7">
              <label for="notes">Notes</label>
              <textarea [(ngModel)]='f.notes' class="form-control" name="notes" rows="5"></textarea>
            </div>

            <!-- purchased card -->
            <div class="col-5">
            <label *ngIf="!isNew" for="purchase">Purchase</label>
              <div *ngIf="this.f.purchase && !isNew" class="purchaseCard card bg-light mb-4">
                <div class="card-header">
                  <div class="float-right text-right">
                    <h2><span class="badge badge-light">$ {{this.f.purchase.price}}</span></h2>
                    <div class="small">{{this.f.purchase.dateSold}}</div>
                  </div>
                </div>
                <div class="card-body text-dark">
                  <div class="row">
                    <div class="mx-auto">
                      <div class="btn-group" role="group">
                        <span class="input-group-addon" id="btnGroupAddon">
                          <img src="assets/24/002-group.png">
                        </span>
                        <input readonly type="text" class="form-control" style="border-radius: 0"
                          value="{{this.f.purchase.patient.firstName}} {{this.f.purchase.patient.lastName}}">
                        <input readonly type="text" class="form-control" style="border-radius: 0" class="col-2"
                          value="$ {{this.f.purchase.price}}">
                        <button type="button" class="btn btn-secondary" (click)="editPurchase()">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- has not been purchased card -->
              <div *ngIf="!this.f.purchase && !isNew" class="purchaseCard card border-danger mb-4">
                <div class="card-header">
                  <div class="float-right text-right">
                  <button type="button" class="btn btn-secondary" (click)="setPurchaser()">
                    Set Purchaser
                  </button>
                  <div class="small">Frame has not been purchased.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>



          <button type="submit" class="btn btn-primary" (click)="onSubmit()"> {{isNew ? 'Add' : 'Save'}} Frame</button>
          <button *ngIf="!isNew" type="button" class="btn btn-outline-danger" (click)="onDelete()">Delete</button>
          <button *ngIf="isNew" type="button" class="btn btn-outline-danger" (click)="onAutoFill()">AutoFill w/ last fame</button>

        </form>
      </div>
    </div>
  `,
})
export class FrameItemComponent implements OnInit {
  @Input() frame: Frame;
  f: Frame; // can work with ngModel
  isNew: boolean = false;

  constructor(private apollo: Apollo, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    if (!this.frame) {
      // Frame object not passed, must make a fresh one
      this.f = {
        //default values here 
        wholesalePrice: 0,
        retailPrice: 0,
        minRetailPrice: 0, 
      } as Frame;
      this.f.dateReceived = new Date(Date.now()).toISOString().slice(0, 10);
      this.isNew = true;
    } else {
      // working with frame object input
      // must remove reference to work with ngModel (or something)
      // this.f = Object.assign({}, this.frame) as Frame;
      this.f = JSON.parse(JSON.stringify(this.frame));
      this.f.dateReceived = new Date(this.f.dateReceived).toISOString().slice(0, 10);

      this.alertService.showAlert('primary', 'Frame loaded: ' + this.f.id);
    }
  }

  setPurchaser() {
    this.router.navigate(['/purchase-edit'], { queryParams: { frameId: this.f.id } });
    // window.open('purchase-edit?frameId=' + this.f.id);
  }

  editPurchase() {
    this.router.navigate(['/purchase-edit'], { queryParams: { purchaseId: this.f.purchase.id } });
    // window.open('purchase-edit?purchaseId=' + this.f.purchase.id);
  }

  retailMultiplier(multiplier) {
    this.f.retailPrice = Math.ceil(this.f.wholesalePrice*multiplier);
  }

  onAutoFill() {
    this.apollo.watchQuery({
      query: GET_LAST_FRAME_QUERY
    }).valueChanges.subscribe(res => {
      // this.allFrames = res.data.allFrames;
      let  lastFrame = res.data['allFrames'][0];
      lastFrame = Object.assign({}, JSON.parse(JSON.stringify(lastFrame))) as Frame;

      // delete objects I don't want copied over
      delete lastFrame.purchase;
      delete lastFrame.id;
      // format for date
      lastFrame.dateReceived = new Date(lastFrame.dateReceived).toISOString().slice(0, 10);
      
      this.f = Object.assign(this.f, lastFrame) as Frame;
    });

  }

  onSubmit() {
    if (!this.f.dateReceived) {
      this.f.dateReceived = new Date(Date.now()).toISOString().slice(0, 10);
    }
    
    if (!this.f.id) { // saving new frame
      this.apollo.mutate({
        mutation: CREATE_FRAME_MUTATION,
        variables: {
          dateReceived: this.f.dateReceived,
          distributor: this.f.distributor,
          brand: this.f.brand,
          model: this.f.model,
          colorCode: this.f.colorCode,
          colorName: this.f.colorName,
          retailPrice: +this.f.retailPrice,
          wholesalePrice: +this.f.wholesalePrice,
          minRetailPrice: +this.f.minRetailPrice,
          sizeA: +this.f.sizeA,
          sizeB: +this.f.sizeB,
          sizeDBL: +this.f.sizeDBL,
          sizeTemple: +this.f.sizeTemple,
          isCloseout: this.f.isCloseout,
          isSun: this.f.isSun,
          isPolarized: this.f.isPolarized,
          isDrillmount: this.f.isDrillmount,
          notes: this.f.notes
        }
      }).subscribe((res) => {
        const returnFrame = res.data.createFrame;
        console.log('CREATE_FRAME_MUTATION ', JSON.stringify(returnFrame))
        this.alertService.showAlert('success', 'Frame has been added.');

        // if this was saved we should have an id in returnFrame
        // no longer consider "new" (not from database)
        this.f = Object.assign(this.f, JSON.parse(JSON.stringify(returnFrame))) as Frame;
        this.isNew = false;

      });
    } else { // saving old frame
      this.apollo.mutate({
        mutation: UPDATE_FRAME_MUTATION,
        variables: {
          id: this.f.id,
          dateReceived: this.f.dateReceived,
          distributor: this.f.distributor,
          brand: this.f.brand,
          model: this.f.model,
          colorCode: this.f.colorCode,
          colorName: this.f.colorName,
          retailPrice: +this.f.retailPrice,
          wholesalePrice: +this.f.wholesalePrice,
          minRetailPrice: +this.f.minRetailPrice,
          sizeA: +this.f.sizeA,
          sizeB: +this.f.sizeB,
          sizeDBL: +this.f.sizeDBL,
          sizeTemple: +this.f.sizeTemple,
          isCloseout: this.f.isCloseout,
          isSun: this.f.isSun,
          isPolarized: this.f.isPolarized,
          isDrillmount: this.f.isDrillmount,
          notes: this.f.notes
        }
      }).subscribe((res) => {
        console.log('UPDATE_FRAME_MUTATION ', JSON.stringify(res.data.updateFrame))

        if (!res.data.updateFrame || !res.data.updateFrame.id) {
          this.alertService.showAlert('danger', 'Something has gone wrong. Check brower console. (ctrl+shift+J)')
        }
        this.alertService.showAlert('success', 'Frame has been updated.');
      });
    }
  }

  onDelete() {
    this.apollo.mutate({
    mutation: gql`
      mutation deleteFrameMutation ($id: ID!) {
        deleteFrame(id: $id) {
          id
        }
      }
    `,
    variables: {
        id: this.f.id // id
    }
    }).subscribe((res) => {
        const id = res.data.deleteFrame.id;
        this.alertService.showAlert('primary', 'Deleted ' + id);
    });
  }

}
