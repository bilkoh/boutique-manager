import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Purchase, Frame } from '@app/types';

import gql from 'graphql-tag';

@Component({
  selector: 'bm-purchase-edit',
  template: `
  <h2>Purchase Edit</h2>
  <div *ngIf="purchaseId && this.allPurchases.length > 0">
    <bm-purchase-item [purchase]="this.allPurchases[0]"></bm-purchase-item>
  </div>

  <div *ngIf="!purchaseId && frameId && this.allFrames.length > 0">
    <div *ngIf="this.allFrames[0].purchase">
    <bm-purchase-item [purchase]="this.allFrames[0].purchase"></bm-purchase-item>
    </div>
    <div *ngIf="!allFrames.purchase">
    <bm-purchase-item [frame]="this.allFrames[0]"></bm-purchase-item>
    </div>
    
  </div>

  <div *ngIf="!purchaseId && !frameId">
    <h4>Need purchaseId or frameId paramter</h4>
  </div>
  `
})
export class PurchaseEditComponent implements OnInit, OnDestroy {
  allPurchases: Purchase[] = [];
  allFrames: Frame[] = [];
  loading = true;
  purchaseId: string; // if passed then we load purchase
  frameId: string; // if passed then we start new purchase and feed it frameId
  routeSub: any;


  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSub = this.route
    .queryParams
    .subscribe(params => {
      this.purchaseId = params['purchaseId'];
      this.frameId = params['frameId'];

    });

    if (this.purchaseId) {
      // if passed then we load purchase
      this.apollo.watchQuery({
          query: gql`
            query PurchaseByIdQuery ($id: ID!) {
                allPurchases (filter: {id: $id }) {
                    id
                    dateSold
                    price
                    frame {
                        id dateReceived brand model colorCode colorName wholesalePrice retailPrice notes
                    }
                    patient {
                        id firstName lastName notes
                    }
                }
            }
          `,
          variables: {
            id: this.purchaseId
          }
      }).valueChanges.subscribe(res => {
          this.allPurchases = res.data['allPurchases'];
          this.loading = res.data['loading'];
          console.log('PurchaseByIdQuery', res.data['allPurchases']);
      });

    } else if (this.frameId) {
      this.apollo.watchQuery({
        query: gql`
          query FrameByIdQuery ($id: ID!) {
            allFrames (filter: {id: $id }) {
              id
              brand
              model
              colorCode
              colorName
              wholesalePrice
              retailPrice
              purchase {
                id
                dateSold
                frame {
                  id
                }
                patient {
                  id
                }
                price
              }
            }
          }
        `,
        variables: {
          id: this.frameId
        }
      }).valueChanges.subscribe(res => {
        this.allFrames = res.data['allFrames'];
        this.loading = res.data['loading'];
        console.log('FrameByIdQuery', res.data['allFrames']);
      })
    }

  }

  ngOnDestroy() {
      this.routeSub.unsubscribe();
  }

}
