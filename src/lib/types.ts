




export type Prescription = {
    sphere: { right: number; left: number };
    cylinder: { right: number; left: number };
    axis: { right: number; left: number };
    add: { right: number; left: number };
}

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    state: string;
  };
  insuranceProvider: string;
  insurancePolicyNumber: string;
  prescription: Prescription;
  lastVisit: string;
  loyaltyPoints?: number;
  loyaltyTier?: LoyaltyTier;
  shopId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  type: 'Eyewear' | 'Service' | 'Contact Lenses';
  brand?: string;
};

export type InvoiceItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  patientId: string;
  patientName: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  items: InvoiceItem[];
  shopId: string;
};

export type PurchaseOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  brand?: string;
};

export type PurchaseOrder = {
    id: string;
    supplier: string;
    orderDate: string;
    total: number;
    status: 'Received' | 'Pending';
    items: PurchaseOrderItem[];
    shopId: string;
}

export type OrderSlip = {
    id: string;
    customerName: string;
    customerPhone: string;
    orderDate: string;
    prescription: {
        rightEye: { sph?: number; cyl?: number; axis?: number; add?: number };
        leftEye: { sph?: number; cyl?: number; axis?: number; add?: number };
    }
    frame: Product | null;
    lenses: Product[];
}

export type Appointment = {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    shopId: string;
}


export type LowStockProduct = Product & {
    stock: number;
};

export type Shop = {
    id: string;
    name: string;
    address: string;
    phone: string;
}

export type Song = {
    title: string;
    artist: string;
    albumArtUrl: string;
    audioSrc: string;
};

export type AdminPaymentNotice = {
    adminEmail: string;
    amountDue: number;
    dueDate: string; // ISO string date
    lockOnExpire: boolean;
    status: 'pending' | 'paid';
}

export type Doctor = {
    id: string;
    name: string;
    email: string;
    lastLogin: string;
}
