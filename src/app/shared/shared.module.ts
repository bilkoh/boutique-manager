/* 3rd party libraries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { FrameItemComponent } from '@app/shared/frame-item.component';
import { PatientItemComponent } from '@app/shared/patient-item.component';
import { PurchaseItemComponent } from '@app/shared/purchase-item.component';
import { PatientPurchaserSelectComponent } from '@app/shared/patient-purchaser-select.component';
import { SelectModule } from 'ng-select';
// import { SelectModule } from 'ng2-select';
// import { MdButtonModule } from '@angular/material';
 
/* our own custom components */
// import { SomeCustomComponent } from './some-custom/some-custom.component';

@NgModule({
  imports: [
    /* angular stuff */
    CommonModule,
    FormsModule,

    /* 3rd party components */
    // MdButtonModule,
    SelectModule,
  ],
  declarations: [
    // SomeCustomComponent
    FrameItemComponent,
    PatientItemComponent,
    PurchaseItemComponent,
    PatientPurchaserSelectComponent,
  ],
  exports: [
    /* angular stuff */
    CommonModule,
    FormsModule,

    /* 3rd party components */
    // MdButtonModule,
    SelectModule,

    /* our own custom components */
    // SomeCustomComponent
    FrameItemComponent,
    PatientItemComponent,
    PurchaseItemComponent,
    PatientPurchaserSelectComponent,
  ]
})
export class SharedModule { }
