import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'bm-patients-page',
  template: `
  <bm-patient-table></bm-patient-table>
  `
})
export class PatientsPageComponent implements OnInit {
    constructor() {}

    ngOnInit() {

    }

}
