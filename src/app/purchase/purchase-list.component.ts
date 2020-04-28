import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Purchase } from '@app/types';

import { ALL_PURCHASES_QUERY, AllPurchasesQueryResponse } from '@app/graphql';

@Component({
  selector: 'bm-purchase-list',
  template: `
  <h4 *ngIf="loading">Loading...</h4>
  <bm-purchase-item *ngFor="let purchase of allPurchases"
            [purchase]="purchase">
  </bm-purchase-item>
  `
})
export class PurchaseListComponent implements OnInit {
  allPurchases: Purchase[] = [];
  loading = true;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: ALL_PURCHASES_QUERY
    }).valueChanges.subscribe(res => {
      this.allPurchases = res.data['allPurchases'];
      this.loading = res.data['loading'];
      console.log('purchases', res.data['allPurchases']);
    });
  }

}
