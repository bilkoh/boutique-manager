import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Patient } from '@app/types';
import gql from 'graphql-tag';
import { all } from 'q';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AlertMessage } from '@app/core/alert.service';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'bm-patient-table',
  template: `
  <h4 *ngIf="loading">Loading...</h4>
  <div id="patientTableComponent">
    <ng2-smart-table
    [settings]="settings"
    (edit)="onEdit($event)"
    [source]="smartTableSource"></ng2-smart-table>
  </div>
  `
})
export class PatientTableComponent implements OnInit {
  allPatients: Patient[] = [];
  loading = true;
  smartTableSource: LocalDataSource;

  settings = {
    mode: 'external',
    actions: {
        columnTitle: 'Edit',
        add: false,
        edit: true,
        delete: false,
    },
    columns: {
      firstName: {
        title: 'First Name',
        width: '10%'
      },
      lastName: {
        title: 'Last Name',
        width: '10%'
      },
      cellPhone: {
        title: 'Cell Phone',
        width: '10%'
      },
      homePhone: {
        title: 'Home Phone',
        width: '10%'
      },
      email: {
        title: 'Email',
        width: '10%'
      },
      purchaseTotal: {
        title: 'Purchase Total'
      },
      notes: {
        title: 'Notes'
      },
    }
  };

  constructor(private apollo: Apollo, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    this.setupSubscriptions();
    this.alertService.showAlert('warning', 'Loading from database.');

    this.apollo.watchQuery({
      query: gql`
        query allPatientsQuery {
          allPatients (orderBy: createdAt_DESC) {
            id
            firstName
            lastName
            cellPhone
            homePhone
            email
            notes
            purchases {
              id
            }
          }
        }
      `
    }).valueChanges.subscribe(res => {
      const allPatients = res.data['allPatients'];
      this.loading = res.data['loading'];
      const patients: Patient[] = [];

      if (allPatients) {
        this.alertService.showAlert('success', allPatients.length + ' patients loaded.');
      }

      allPatients.forEach(patient => {
        const f = this.getPatientTableRowFromDBResult(patient);

        patients.push(f);
      });

      this.allPatients = patients;
      this.smartTableSource = new LocalDataSource(this.allPatients);
    });
  }

  onEdit(event) {
    window.open('patient-edit?patientId=' + event.data.id);
  }

  getPatientTableRowFromDBResult(patientDBRes) {
    const f = Object.assign({}, JSON.parse(JSON.stringify(patientDBRes)));
    f.purchaseTotal = f.purchases.length;

    return f;
  }

  setupSubscriptions() {
    let webSocket = new WebSocket('wss://subscriptions.graph.cool/v1/cjaasso0m081q0123g05giabw', 'graphql-subscriptions');
    webSocket.onopen = (event) => {
      const message = {
          type: 'init'
      }
    
      webSocket.send(JSON.stringify(message))
    }

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
    
      switch (data.type) {
        case 'init_success': {
          console.log('init_success, the handshake is complete');

          const mutations = ['CREATED', 'UPDATED', 'DELETED'];

          for (var index = 0; index < mutations.length; index++) {
            var mutation = mutations[index];

            const message = {
              id: index + 1,
              type: 'subscription_start',
              query: `
                subscription newPatients {
                  Patient(filter: {
                    mutation_in: [${mutation}]
                  }) {
                    mutation
                    node {
                      id
                      firstName
                      lastName
                      cellPhone
                      homePhone
                      email
                      notes
                      purchases {
                        id
                      }
                    }
                  }
                }
              `
            }
            webSocket.send(JSON.stringify(message))
            
          }
          break
        }
        case 'init_fail': {
          throw {
            message: 'init_fail returned from WebSocket server',
            data
          }
        }
        case 'subscription_data': {
          console.log('subscription data has been received', data.payload.data['Patient'])

          const resPatient = data.payload.data['Patient'];

          if (resPatient) {
            switch (resPatient.mutation){
              case 'CREATED': {
                console.log(resPatient.mutation, resPatient.node.id);
                const node = resPatient.node;
                const newPatient = this.getPatientTableRowFromDBResult(node);
                this.allPatients.push(newPatient);
                this.smartTableSource.refresh();
                break;
              }
              case 'UPDATED': {
                console.log(resPatient.mutation, resPatient.node.id);
                const node = resPatient.node;

                let patientNeedingUpdate = this.allPatients.find(x => x.id === node.id);
                console.log(patientNeedingUpdate)

                if (patientNeedingUpdate) {
                  patientNeedingUpdate = Object.assign(patientNeedingUpdate, this.getPatientTableRowFromDBResult(node));
                  this.smartTableSource.refresh();
                }
                break;
              }
              case 'DELETED': {
                console.log(resPatient.mutation, resPatient); // node is null
                
                break;
              }
            }
          }
          break
        }
        case 'subscription_success': {
          console.log('subscription_success')
          break
        }
        case 'subscription_fail': {
          throw {
            message: 'subscription_fail returned from WebSocket server',
            data
          }
        }
      }
    }
  }
}
