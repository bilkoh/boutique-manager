import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Patient } from '@app/types';
import { Router } from '@angular/router';

import { AlertService, AlertMessage } from '@app/core/alert.service';

import { UPDATE_PATIENT_MUTATION, CREATE_PATIENT_MUTATION } from '@app/graphql';
import gql from 'graphql-tag';

@Component({
  selector: 'bm-patient-item',
  template: `
    <div class="card patientItemComponent mb-4">
      <div class="card-header">
        Patient
        <span *ngIf="isNew" class="badge badge-info float-right">* New Patient. Yet to be added.</span>
      </div>
      <div class="card-body">

        <form>
          <div class="form-row">
            <div class="form-group col">
              <label for="firstName">First Name</label>
              <input [(ngModel)]='p.firstName' type="text" class="form-control" name="firstName" placeholder="eg: Hingle">
            </div>
            <div class="form-group col">
              <label for="lastName">Last Name</label>
              <input [(ngModel)]='p.lastName' type="text" class="form-control" name="lastName" placeholder="eg: McKringleberry">
            </div>
            <div class="form-group col">
              <label for="cellPhone">Cell Phone</label>
              <input [(ngModel)]='p.cellPhone' type="text" class="form-control" name="cellPhone" placeholder="eg: 555-123-1234">
            </div>
            <div class="form-group col">
              <label for="homePhone">Home Phone</label>
              <input [(ngModel)]='p.homePhone' type="text" class="form-control" name="homePhone" placeholder="eg: 555-321-4321">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="addressLine1">Address Line</label>
              <input [(ngModel)]='p.addressLine1' type="text" class="form-control"
                name="addressLine1" placeholder="eg: 1234 Fif Street">
            </div>
            <div class="form-group col-md-6">
              <label for="email">Email</label>
              <input [(ngModel)]='p.email' type="email" class="form-control"
                name="email" placeholder="eg: hyperthruster@pennstate.edu">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="addressLine2">Address Line2</label>
              <input [(ngModel)]='p.addressLine2' type="text" class="form-control"
                name="addressLine2" placeholder="eg: Pittsburg, PA 15106">
            </div>
            <div class="form-group form-check col">
              <label class="form-check-label" for="doNotText">
                <input [(ngModel)]='p.doNotText' class="form-check-input" name="doNotText" type="checkbox" unchecked>
                Opt out of texts?
              </label>
            </div>
            <div class="form-group form-check col">
              <label class="form-check-label" for="doNotEmail">
                <input [(ngModel)]='p.doNotEmail' class="form-check-input" name="doNotEmail" type="checkbox" unchecked>
                Opt out of emails?
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-7">
              <label for="notes">Notes</label>
              <textarea [(ngModel)]='p.notes' class="form-control" name="notes" rows="3"></textarea>
            </div>

            <div class="col-5">
              <label>Purchases</label>
              <div *ngIf="!isNew" class="purchaseCard card bg-light mb-4">
                <div class="card-header">
                  <div class="float-right text-right">
                    <h6><span class="badge badge-light">[ {{p.purchases.length}} ]</span></h6>
                  </div>
                </div>
                <ul class="list-group list-group-flush">
                  <li *ngFor="let purchase of p.purchases" class="list-group-item">
                    <!-- {{purchase.id}} -->
                    <div class="row">
                      <div class="mx-auto">
                        <div class="btn-group" role="group">
                          <span class="input-group-addon" id="btnGroupAddon">
                            <img src="assets/24/003-sunglasses.png">
                          </span>
                          <input readonly type="text" class="form-control" style="border-radius: 0"
                            value="{{purchase.frame.brand}} {{purchase.frame.model}}">
                          <input readonly type="text" class="form-control" style="border-radius: 0" class="col-3"
                            value="$ {{purchase.price}}">
                          <button type="button" class="btn btn-secondary" (click)="editPurchase(purchase.id)">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" (click)="onSubmit()"> {{isNew ? 'Add' : 'Save'}} Patient</button>
          <button *ngIf="!isNew" type="button" class="btn btn-outline-danger" (click)="onDelete()">Delete</button>

        </form>

      </div>
    </div>
  `,
})
export class PatientItemComponent implements OnInit {
  @Input() patient: Patient;
  p: Patient; // can work with ngModel
  isNew: boolean = false;

  constructor(private apollo: Apollo, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    if (!this.patient) {
      // patient object not passed, must make a fresh one
      this.p = {} as Patient;
      this.isNew = true;
    } else {
      // working with patient object input
      // must remove reference to work with ngModel (or something)
      // this.p = Object.assign({}, this.patient) as Patient;
      this.p = JSON.parse(JSON.stringify(this.patient));
      
    }
  }

  onSubmit() {
    if (!this.p.id) { // saving new frame
      this.apollo.mutate({
        mutation: CREATE_PATIENT_MUTATION,
        variables: {
          firstName: this.p.firstName,
          lastName: this.p.lastName,
          cellPhone: this.p.cellPhone,
          homePhone: this.p.homePhone,
          email: this.p.email,
          addressLine1: this.p.addressLine1,
          addressLine2: this.p.addressLine2,
          doNotText: this.p.doNotText,
          doNotEmail: this.p.doNotEmail,
          notes: this.p.notes,
        }
      }).subscribe((res) => {
        const returnPatient = res.data.createPatient;
        console.log('CREATE_PATIENT_MUTATION ' + JSON.stringify(returnPatient));
        this.alertService.showAlert('primary', 'Patient has been created.');

        // if this was saved we should have an id in returnPatient
        // no longer consider "new" (not from database)
        this.p = Object.assign(this.p, JSON.parse(JSON.stringify(returnPatient))) as Patient;
        this.isNew = false;
      });

    } else { // saving old frame
      this.apollo.mutate({
        mutation: UPDATE_PATIENT_MUTATION,
        variables: {
          id: this.p.id,
          firstName: this.p.firstName,
          lastName: this.p.lastName,
          cellPhone: this.p.cellPhone,
          homePhone: this.p.homePhone,
          email: this.p.email,
          addressLine1: this.p.addressLine1,
          addressLine2: this.p.addressLine2,
          doNotText: this.p.doNotText,
          doNotEmail: this.p.doNotEmail,
          notes: this.p.notes,
        }
      }).subscribe((res) => {
        console.log('res:', res);
        'UPDATE_PATIENT_MUTATION ' + JSON.stringify(res.data.updatePatient)
        this.alertService.showAlert('primary', 'Patient has been updated.');
      });
    }
  }

  editPurchase(purchseId) {
    // console.log(purchseId);
    this.router.navigate(['/purchase-edit'], { queryParams: { purchaseId: purchseId } });
    // window.open('purchase-edit?purchaseId=' + this.f.purchase.id);
  }

  onDelete() {
    this.apollo.mutate({
    mutation: gql`
      mutation deletePatientMutation ($id: ID!) {
        deletePatient(id: $id) {
          id
        }
      }
    `,
    variables: {
        id: this.p.id // id
    }
    }).subscribe((res) => {
        const id = res.data.deletePatient.id;
        this.alertService.showAlert('primary', 'Deleted ' + id);
    });
  }

}
