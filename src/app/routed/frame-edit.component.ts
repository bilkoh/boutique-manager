  import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Purchase, Frame } from '@app/types';

import gql from 'graphql-tag';

@Component({
  selector: 'bm-frame-edit',
  template: `
  <h2>Frame Edit</h2>
  <div *ngIf="frameId && frame">
    <bm-frame-item [frame]="frame"></bm-frame-item>
  </div>
  <div *ngIf="!frameId">
    <bm-frame-item></bm-frame-item>
  </div>
  `
})
export class FrameEditComponent implements OnInit, OnDestroy {
  loading = true;
  frameId: string; // if passed then we start new purchase and feed it frameId
  frame: Frame;
  routeSub: any;


  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) {
    // when we refersh this page, it reloads completely.
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
          // trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
          // if you need to scroll back to top, here is the right place
          window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    this.routeSub = this.route
    .queryParams
    .subscribe(params => {
      this.frameId = params['frameId'];

    });

    if (this.frameId) {
      // if passed then we load purchase
      this.apollo.watchQuery({
          query: gql`
            query FrameByIdQuery ($id: ID!) {
              allFrames (filter: {id: $id }) {
                id
                distributor
                createdAt
                updatedAt
                dateReceived
                brand
                model
                colorCode
                colorName
                wholesalePrice
                retailPrice
                minRetailPrice
                sizeA
                sizeB
                sizeDBL
                sizeTemple
                isCloseout
                isSun
                isPolarized
                isDrillmount
                notes
                purchase {
                  id
                  dateSold
                  price
                  patient {
                    id
                    firstName
                    lastName
                  }
                }
              }
            }
          `,
          variables: {
            id: this.frameId
          }
      }).valueChanges.subscribe(res => {
        if (res.data['allFrames'].length > 0) {
          this.frame = res.data['allFrames'][0];
          this.loading = res.data['loading'];
          console.log('FrameByIdQuery', this.frame);
        }
      });

    } else {
      // frameId not passed
    }

  }

  ngOnDestroy() {
      this.routeSub.unsubscribe();
  }

}
