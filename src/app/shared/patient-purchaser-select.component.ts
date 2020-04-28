import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Patient } from '@app/types';

import { PATIENT_SELECT_QUERY } from '@app/graphql';

@Component({
  selector: 'bm-patient-purchaser-select',
  template: `
  <ng-select #patientSelector
    [allowClear]="true"
    (selected)="onSelect($event)"
    (deselected)="onDeselected($event)"
    [options]="allPatients"></ng-select>
  <!-- <ng-select [allowClear]="true" [items]="allPatients" placeholder="Select Patient"></ng-select> -->

  `
})
export class PatientPurchaserSelectComponent implements OnInit, AfterViewInit {
  // allPatients: Patient[] = [];
  allPatients = [];
  loading = true;
  @Input() selectedPatientId: string;
  @ViewChild('patientSelector') patientSelector;
  @Output() onPatientSelect = new EventEmitter<string>();

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: PATIENT_SELECT_QUERY
    }).valueChanges.subscribe(res => {
      // this.allPatients = res.data['allPatients'];
      this.loading = res.data['loading'];

      this.allPatients = res.data['allPatients'].map(val => {
          return {value: val.id, label: 
            (val.firstName ? val.firstName : '')
            + ' ' + 
            (val.lastName ? val.lastName : '')
          };
          // return {id: val.id, text: val.firstName + ' ' + val.lastName};
      });

      console.log('PATIENT_SELECT_QUERY', this.allPatients);
    });
  }

  ngAfterViewInit() {
    if (this.selectedPatientId) {
      this.patientSelector.select(this.selectedPatientId);
    }
  }

  onSelect(option: any) {
    // console.log(option);
    this.onPatientSelect.emit(option.value);
  }

  onDeselected(option: any) {
    // console.log('deslected');
    this.onPatientSelect.emit('');
  }

}
