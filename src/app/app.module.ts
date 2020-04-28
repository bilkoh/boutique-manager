import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { GraphQLModule } from '@app/apollo.config';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';

import { AppComponent } from '@app/app.component';
import { AlertLoggerComponent } from '@app/alert-logger/alert-logger.component';
import { FrameListComponent } from '@app/frame/frame-list.component';
import { FrameTableComponent } from '@app/frame/frame-table.component';
import { PatientListComponent } from '@app/patient/patient-list.component';
import { PatientTableComponent } from '@app/patient/patient-table.component';
import { PurchaseListComponent } from '@app/purchase/purchase-list.component';
import { PurchaseEditComponent } from '@app/routed/purchase-edit.component';
import { FrameEditComponent } from '@app/routed/frame-edit.component';
import { PatientEditComponent } from '@app/routed/patient-edit.component';
import { HomeComponent } from '@app/routed/home.component';
import { FramesPageComponent } from '@app/routed/frames-page.component';
import { PatientsPageComponent } from '@app/routed/patients-page.component';

// import { PatientSelectComponent } from '@app/patient/patient-select.component';

const routes: Routes = [
  { path: 'purchase-edit', component: PurchaseEditComponent },
  { path: 'frame-edit', component: FrameEditComponent },
  { path: 'patient-edit', component: PatientEditComponent },
  { path: 'frames', component: FramesPageComponent },
  { path: 'patients', component: PatientsPageComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    AlertLoggerComponent,
    FrameListComponent,
    PatientListComponent,
    PurchaseListComponent,
    PurchaseEditComponent,
    FrameEditComponent,
    PatientEditComponent,
    HomeComponent,
    FramesPageComponent,
    PatientsPageComponent,
    FrameTableComponent,
    PatientTableComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BsDropdownModule.forRoot(), // needed for nav in app component
    AlertModule.forRoot(), // neded for alerts in alert-logger component
    Ng2SmartTableModule,
    CoreModule,
    BrowserModule,
    GraphQLModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
