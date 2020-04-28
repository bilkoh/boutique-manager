
export class Frame {
    createdAt?: string;
    updatedAt?: string;
    dateReceived?: string;
    id?: string;
    distributor?: string;
    brand?: string;
    model?: string;
    colorCode?: string;
    colorName?: string;
    wholesalePrice?: number;
    retailPrice?: number;
    minRetailPrice?: number;
    sizeA?: number;
    sizeB?: number;
    sizeDBL?: number;
    sizeTemple?: number;
    isCloseout?: boolean;
    isSun?: boolean;
    isPolarized?: boolean;
    isDrillmount?: boolean;
    notes?: string;
    purchase?: Purchase;
}

export class Patient {
    createdAt?: string;
    updatedAt?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    cellPhone?: string;
    homePhone?: string;
    email?: string;
    addressLine1: string;
    addressLine2: string;
    doNotText: boolean;
    doNotEmail: boolean;
    notes?: string;
    purchases?: Purchase[];
}

export class Purchase {
    createdAt?: string;
    updatedAt?: string;
    dateSold?: string;
    id?: string;
    price?: number;
    frame?: Frame;
    patient?: Patient;
}
