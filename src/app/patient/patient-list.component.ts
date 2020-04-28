import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Patient } from '@app/types';

import { ALL_PATIENTS_QUERY, AllPatientsQueryResponse } from '@app/graphql';

@Component({
  selector: 'bm-patient-list',
  template: `
  <h4 *ngIf="loading">Loading...</h4>
  <bm-patient-item *ngFor="let patient of allPatients"
            [patient]="patient">
  </bm-patient-item>
  `
})
export class PatientListComponent implements OnInit {
  allPatients: Patient[] = [];
  loading = true;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: ALL_PATIENTS_QUERY
    }).valueChanges.subscribe(res => {
      this.allPatients = res.data['allPatients'];
      this.loading = res.data['loading'];
      console.log('patients', res.data['allPatients']);
    });
  }

}
