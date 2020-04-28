import { Frame, Patient, Purchase } from './types';
import gql from 'graphql-tag';
import { interceptingHandler } from '@angular/common/http/src/module';

export const ALL_FRAMES_QUERY = gql`
    query AllFramesQuery {
        allFrames {
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
`;

export const GET_LAST_FRAME_QUERY = gql`
query GetLastFrameQuery {
    allFrames (first:1, orderBy: createdAt_DESC) {
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
`;

export interface AllFramesQueryResponse {
    allFrames: Frame[];
    loading: boolean;
}

export const CREATE_FRAME_MUTATION = gql`
    mutation CreateFrameMutation($dateReceived: DateTime!, $distributor: String,
    $brand: String, $model: String, $wholesalePrice: Float, $retailPrice: Float, $minRetailPrice: Float,
    $sizeA: Int, $sizeB: Int, $sizeDBL: Int, $sizeTemple: Int, $isCloseout: Boolean, $isSun: Boolean,
    $colorCode: String, $colorName: String, $isPolarized: Boolean, $isDrillmount: Boolean, $notes: String) {
        createFrame(
            dateReceived: $dateReceived
            distributor: $distributor
            brand: $brand
            model: $model
            colorCode: $colorCode
            colorName: $colorName
            wholesalePrice: $wholesalePrice
            retailPrice: $retailPrice
            minRetailPrice: $minRetailPrice
            sizeA: $sizeA
            sizeB: $sizeB
            sizeDBL: $sizeDBL
            sizeTemple: $sizeTemple
            isCloseout: $isCloseout
            isSun: $isSun
            isPolarized: $isPolarized
            isDrillmount: $isDrillmount
            notes: $notes
        ) {
            id
        }
    }
`;

export interface CreateFrameMutationResponse {
    createFrame: Frame;
    loading: boolean;
}

export const UPDATE_FRAME_MUTATION = gql`
mutation UpdateFrameMutation($id: ID!, $dateReceived: DateTime!, $distributor: String,
    $brand: String, $model: String, $wholesalePrice: Float, $retailPrice: Float, $minRetailPrice: Float,
    $sizeA: Int, $sizeB: Int, $sizeDBL: Int, $sizeTemple: Int, $isCloseout: Boolean, $isSun: Boolean,
    $colorCode: String, $colorName: String, $isPolarized: Boolean, $isDrillmount: Boolean, $notes: String) {
        updateFrame(
            id: $id
            dateReceived: $dateReceived
            distributor: $distributor
            brand: $brand
            model: $model
            colorCode: $colorCode
            colorName: $colorName
            wholesalePrice: $wholesalePrice
            retailPrice: $retailPrice
            minRetailPrice: $minRetailPrice
            sizeA: $sizeA
            sizeB: $sizeB
            sizeDBL: $sizeDBL
            sizeTemple: $sizeTemple
            isCloseout: $isCloseout
            isSun: $isSun
            isPolarized: $isPolarized
            isDrillmount: $isDrillmount
            notes: $notes
        ) {
            id
        }
    }
`;

// -------------
export const ALL_PATIENTS_QUERY = gql`
query AllPatientsQuery {
    allPatients {
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
`;

export interface AllPatientsQueryResponse {
    allPatients: Patient[];
    loading: boolean;
}

export const PATIENT_SELECT_QUERY = gql`
query PatientSelectQuery {
    allPatients {
        id
        firstName
        lastName
    }
}
`;

export const CREATE_PATIENT_MUTATION = gql`
mutation CreatePatientMutation(
  $firstName: String,
  $lastName: String,
  $cellPhone: String,
  $homePhone: String,
  $email: String,
  $addressLine1: String,
  $addressLine2: String,
  $doNotText: Boolean,
  $doNotEmail: Boolean,
  $notes: String
) {
        createPatient(
            firstName: $firstName
            lastName: $lastName
            cellPhone: $cellPhone
            homePhone: $homePhone
            email: $email
            addressLine1: $addressLine1
            addressLine2: $addressLine2
            doNotText: $doNotText
            doNotEmail: $doNotEmail
            notes: $notes
        ) {
            id
            purchases {
                id
            }
        }
    }
`;

export const UPDATE_PATIENT_MUTATION = gql`
mutation UpdatePatientMutation($id: ID!,
  $firstName: String,
  $lastName: String,
  $cellPhone: String,
  $homePhone: String,
  $email: String,
  $addressLine1: String,
  $addressLine2: String,
  $doNotText: Boolean,
  $doNotEmail: Boolean,
  $notes: String
) {
        updatePatient(
            id: $id
            firstName: $firstName
            lastName: $lastName
            cellPhone: $cellPhone
            homePhone: $homePhone
            email: $email
            addressLine1: $addressLine1
            addressLine2: $addressLine2
            doNotText: $doNotText
            doNotEmail: $doNotEmail
            notes: $notes
        ) {
            id
        }
    }
`;


// -------------
export const ALL_PURCHASES_QUERY = gql`
query AllPurchasesQuery {
    allPurchases {
        id
        dateSold
        price
        frame {
            id
            dateReceived
            brand
            model
            colorCode
            colorName
            notes
        }
        patient {
            id
            firstName
            lastName
            notes
        }
    }
}
`;

export interface AllPurchasesQueryResponse {
    allPurchases: Purchase[];
    loading: boolean;
}

export const PURCHASE_BY_ID_QUERY = gql`
query PurchaseByIdQuery ($id: ID!) {
    allPurchases (filter: {id: $id }) {
        id
        dateSold
        price
        frame {
            id
            dateReceived
            brand
            model
            colorCode
            colorName
            notes
        }
        patient {
            id
            firstName
            lastName
            notes
        }
    }
}
`;
