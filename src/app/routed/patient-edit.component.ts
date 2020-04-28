import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Patient } from '@app/types';

import gql from 'graphql-tag';

@Component({
  selector: 'bm-patient-edit',
  template: `
  <h2>Patient Edit</h2>
  <div *ngIf="patientId && patient">
    <bm-patient-item [patient]="patient"></bm-patient-item>
  </div>
  <div *ngIf="!patientId">
    <bm-patient-item></bm-patient-item>
  </div>
  `
})
export class PatientEditComponent implements OnInit, OnDestroy {
  loading = true;
  patientId: string; // if passed then we start new purchase and feed it patientId
  patient: Patient;
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
      this.patientId = params['patientId'];

    });

    if (this.patientId) {
      // if passed then we load purchase
      this.apollo.watchQuery({
          query: gql`
            query PatientByIdQuery ($id: ID!) {
              allPatients (filter: {id: $id }) {
                id
                firstName
                lastName
                cellPhone
                homePhone
                email
                addressLine1
                addressLine2
                doNotText
                doNotEmail
                notes
                purchases {
                  id
                  dateSold
                  price
                  frame {
                    id
                    brand
                    model
                  }
                }
            }
            }
          `,
          variables: {
            id: this.patientId
          }
      }).valueChanges.subscribe(res => {
        if (res.data['allPatients'].length > 0) {
          this.patient = res.data['allPatients'][0];
          this.loading = res.data['loading'];
          console.log('PatientByIdQuery', this.patient);
        }
      });

    } else {
      // patientId not passed
    }

  }

  ngOnDestroy() {
      this.routeSub.unsubscribe();
  }

}
