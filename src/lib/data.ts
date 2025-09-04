

import type { Patient, Product, Invoice, LoyaltyTier, PurchaseOrder, Appointment, Shop, Song, AdminPaymentNotice, Doctor } from './types';
import { addDays, format } from 'date-fns';

export const currencies = [
    { code: 'USD', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', name: 'Euro', locale: 'de-DE' },
    { code: 'JPY', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'GBP', name: 'British Pound', locale: 'en-GB' },
    { code: 'AUD', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CAD', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
    { code: 'CNY', name: 'Chinese Yuan', locale: 'zh-CN' },
    { code: 'INR', name: 'Indian Rupee', locale: 'en-IN' },
];

// Rates are against 1 USD
export const MOCK_RATES: Record<string, number> = {
    USD: 1.00,
    EUR: 0.92,
    JPY: 157.00,
    GBP: 0.79,
    AUD: 1.50,
    CAD: 1.37,
    CHF: 0.90,
    CNY: 7.25,
    INR: 83.50,
};


export const shops: Shop[] = [
    {
        id: 'SHOP001',
        name: 'OptiVision Flagship (Optic City)',
        address: '123 Visionary Ave, Optic City, CA 90210',
        phone: '555-123-4567',
    },
    {
        id: 'SHOP002',
        name: 'OptiVision Visionville',
        address: '456 Lens Lane, Visionville, CA 90211',
        phone: '555-987-6543',
    }
]

export const patients: Patient[] = [
  {
    id: 'PAT001',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '555-0101',
    address: { city: 'Optic City', state: 'CA' },
    insuranceProvider: 'Global Health',
    insurancePolicyNumber: 'GH-12345678',
    prescription: {
      sphere: { right: -1.25, left: -1.5 },
      cylinder: { right: -0.5, left: -0.75 },
      axis: { right: 180, left: 175 },
      add: { right: 0, left: 0 },
    },
    lastVisit: '2023-10-15',
    loyaltyPoints: 1250,
    loyaltyTier: 'Silver',
    shopId: 'SHOP001',
  },
  {
    id: 'PAT002',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    phone: '555-0102',
    address: { city: 'Visionville', state: 'CA' },
    insuranceProvider: 'United Coverage',
    insurancePolicyNumber: 'UC-87654321',
    prescription: {
      sphere: { right: 2.0, left: 2.25 },
      cylinder: { right: 0, left: 0 },
      axis: { right: 0, left: 0 },
      add: { right: 1.75, left: 1.75 },
    },
    lastVisit: '2023-11-02',
    loyaltyPoints: 800,
    loyaltyTier: 'Bronze',
    shopId: 'SHOP002',
  },
  {
    id: 'PAT003',
    name: 'Anjali Singh',
    email: 'anjali.s@example.com',
    phone: '555-0103',
    address: { city: 'Optic City', state: 'CA' },
    insuranceProvider: 'Nile Assurance',
    insurancePolicyNumber: 'NA-10101010',
     prescription: {
      sphere: { right: -3.50, left: -3.75 },
      cylinder: { right: -1.25, left: -1.0 },
      axis: { right: 90, left: 85 },
      add: { right: 0, left: 0 },
    },
    lastVisit: '2023-09-20',
    loyaltyPoints: 2100,
    loyaltyTier: 'Gold',
    shopId: 'SHOP001',
  },
   {
    id: 'PAT004',
    name: 'Vikram Kumar',
    email: 'vikram.k@example.com',
    phone: '555-0104',
    address: { city: 'Lensburg', state: 'CA' },
    insuranceProvider: 'Magic Shield',
    insurancePolicyNumber: 'MS-24681357',
     prescription: {
      sphere: { right: 0.5, left: 0.25 },
      cylinder: { right: 0, left: 0 },
      axis: { right: 0, left: 0 },
      add: { right: 2.5, left: 2.5 },
    },
    lastVisit: '2024-01-05',
    loyaltyPoints: 50,
    loyaltyTier: 'Bronze',
    shopId: 'SHOP002',
  },
  {
    id: 'PAT005',
    name: 'Sunita Patil',
    email: 'sunita.p@example.com',
    phone: '555-0105',
    address: { city: 'Optic City', state: 'CA' },
    insuranceProvider: 'Global Health',
    insurancePolicyNumber: 'GH-98765432',
    prescription: {
        sphere: { right: -2.0, left: -2.25 },
        cylinder: { right: 0, left: 0 },
        axis: { right: 0, left: 0 },
        add: { right: 0, left: 0 },
    },
    lastVisit: '2024-03-12',
    loyaltyPoints: 450,
    loyaltyTier: 'Bronze',
    shopId: 'SHOP001',
  }
];

export const products: Product[] = [
  {
    id: 'Z5X-C9V-B2N',
    name: 'VisionPro Ultra-Thin Frames',
    description: 'Lightweight and durable frames for all-day comfort.',
    price: 199.99,
    stock: 50,
    type: 'Eyewear',
    brand: 'VisionPro',
  },
  {
    id: 'A1S-D4F-G7H',
    name: 'Comprehensive Eye Exam',
    description: 'Full eye health and vision assessment.',
    price: 120.0,
    stock: 999,
    type: 'Service',
  },
  {
    id: 'Q2W-E5R-T8Y',
    name: 'AquaSoft Daily Lenses (30-pack)',
    description: 'Daily disposable contact lenses for ultimate convenience.',
    price: 45.5,
    stock: 200,
    type: 'Contact Lenses',
    brand: 'AquaSoft',
  },
  {
    id: 'U3I-O6P-L9K',
    name: 'Blue-Light Filtering Add-on',
    description: 'Protect your eyes from digital screen strain.',
    price: 50.0,
    stock: 999,
    type: 'Service',
  },
   {
    id: 'M4N-B7V-C1X',
    name: 'Ray-Ban Aviator Classic',
    description: 'Timeless style and 100% UV protection.',
    price: 154.0,
    stock: 25,
    type: 'Eyewear',
    brand: 'Ray-Ban',
  },
  {
    id: 'GUC-123-XYZ',
    name: 'Gucci GG0276S Sunglasses',
    description: 'Oversized square sunglasses with a bold aesthetic.',
    price: 450.0,
    stock: 15,
    type: 'Eyewear',
    brand: 'Gucci',
  },
  {
    id: 'ARM-456-ABC',
    name: 'Armani Exchange AX3050',
    description: 'Modern and versatile rectangular frames.',
    price: 130.0,
    stock: 30,
    type: 'Eyewear',
    brand: 'Armani',
  },
    {
    id: 'RAY-789-DEF',
    name: 'Ray-Ban Wayfarer Classic',
    description: 'The most recognizable style in the history of sunglasses.',
    price: 161.0,
    stock: 40,
    type: 'Eyewear',
    brand: 'Ray-Ban',
  },
  {
    id: 'LOCAL-001',
    name: 'Classic Round Frames',
    description: 'Simple and elegant round frames for a timeless look.',
    price: 79.99,
    stock: 100,
    type: 'Eyewear',
  },
  {
    id: 'LOCAL-002',
    name: 'Modern Cat-Eye Glasses',
    description: 'A stylish cat-eye design with a modern twist.',
    price: 89.99,
    stock: 80,
    type: 'Eyewear',
  },
  {
    id: 'LOCAL-003',
    name: 'Minimalist Rectangular Frames',
    description: 'Sleek and professional rectangular frames.',
    price: 75.00,
    stock: 120,
    type: 'Eyewear',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    patientId: 'PAT001',
    patientName: 'Priya Sharma',
    issueDate: '2023-10-15',
    dueDate: '2023-11-14',
    total: 249.99,
    status: 'Paid',
    items: [
      { productId: 'Z5X-C9V-B2N', productName: 'VisionPro Ultra-Thin Frames', quantity: 1, unitPrice: 199.99 },
      { productId: 'U3I-O6P-L9K', productName: 'Blue-Light Filtering Add-on', quantity: 1, unitPrice: 50.00 },
    ],
    shopId: 'SHOP001',
  },
  {
    id: 'INV-2024-002',
    patientId: 'PAT002',
    patientName: 'Rohan Mehta',
    issueDate: '2023-11-02',
    dueDate: '2023-12-02',
    total: 120.0,
    status: 'Overdue',
    items: [
        { productId: 'A1S-D4F-G7H', productName: 'Comprehensive Eye Exam', quantity: 1, unitPrice: 120.00 },
    ],
    shopId: 'SHOP002',
  },
  {
    id: 'INV-2024-003',
    patientId: 'PAT003',
    patientName: 'Anjali Singh',
    issueDate: '2023-09-20',
    dueDate: '2023-10-20',
    total: 45.5,
    status: 'Paid',
    items: [
      { productId: 'Q2W-E5R-T8Y', productName: 'AquaSoft Daily Lenses (30-pack)', quantity: 1, unitPrice: 45.50 },
    ],
    shopId: 'SHOP001',
  },
  {
    id: 'INV-2024-004',
    patientId: 'PAT004',
    patientName: 'Vikram Kumar',
    issueDate: '2024-01-05',
    dueDate: '2024-02-04',
    total: 120.0,
    status: 'Unpaid',
    items: [
        { productId: 'A1S-D4F-G7H', productName: 'Comprehensive Eye Exam', quantity: 1, unitPrice: 120.00 },
    ],
    shopId: 'SHOP002'
  },
  {
    id: 'INV-2024-005',
    patientId: 'PAT001',
    patientName: 'Priya Sharma',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    total: 161.0,
    status: 'Paid',
    items: [
      { productId: 'RAY-789-DEF', productName: 'Ray-Ban Wayfarer Classic', quantity: 1, unitPrice: 161.00 },
    ],
    shopId: 'SHOP001',
  },
  {
    id: 'INV-2024-006',
    patientId: 'PAT005',
    patientName: 'Sunita Patil',
    issueDate: '2024-03-12',
    dueDate: '2024-04-11',
    total: 329.99,
    status: 'Paid',
    items: [
        { productId: 'GUC-123-XYZ', productName: 'Gucci GG0276S Sunglasses', quantity: 1, unitPrice: 279.99 },
        { productId: 'U3I-O6P-L9K', productName: 'Blue-Light Filtering Add-on', quantity: 1, unitPrice: 50.00 },
    ],
    shopId: 'SHOP001',
  },
  {
    id: 'INV-2024-007',
    patientId: 'PAT002',
    patientName: 'Rohan Mehta',
    issueDate: '2024-04-15',
    dueDate: '2024-05-15',
    total: 130.00,
    status: 'Paid',
    items: [
        { productId: 'ARM-456-ABC', productName: 'Armani Exchange AX3050', quantity: 1, unitPrice: 130.00 },
    ],
    shopId: 'SHOP002',
  },
];


export const purchaseOrders: PurchaseOrder[] = [
    {
        id: 'PO-2024-001',
        supplier: 'VisionPro Optics',
        orderDate: '2024-01-10',
        total: 2500,
        status: 'Received',
        items: [
            { productId: 'Z5X-C9V-B2N', productName: 'VisionPro Ultra-Thin Frames', quantity: 25, unitPrice: 100, brand: 'VisionPro' },
        ],
        shopId: 'SHOP001',
    },
    {
        id: 'PO-2024-002',
        supplier: 'Ray-Ban Inc.',
        orderDate: '2024-01-15',
        total: 3500,
        status: 'Received',
        items: [
            { productId: 'M4N-B7V-C1X', productName: 'Ray-Ban Aviator Classic', quantity: 25, unitPrice: 80, brand: 'Ray-Ban' },
            { productId: 'RAY-789-DEF', productName: 'Ray-Ban Wayfarer Classic', quantity: 25, unitPrice: 60, brand: 'Ray-Ban' },
        ],
        shopId: 'SHOP001',
    },
    {
        id: 'PO-2024-003',
        supplier: 'AquaSoft Global',
        orderDate: '2024-02-05',
        total: 2000,
        status: 'Pending',
        items: [
            { productId: 'Q2W-E5R-T8Y', productName: 'AquaSoft Daily Lenses (30-pack)', quantity: 100, unitPrice: 20, brand: 'AquaSoft' },
        ],
        shopId: 'SHOP002',
    }
];

export const appointments: Appointment[] = [
    { id: 'APP001', patientId: 'PAT001', patientName: 'Priya Sharma', doctorName: 'Dr. Sunita Gupta', date: format(new Date(), 'yyyy-MM-dd'), time: '10:00 AM', status: 'Scheduled', shopId: 'SHOP001' },
    { id: 'APP002', patientId: 'PAT002', patientName: 'Rohan Mehta', doctorName: 'Dr. Ramesh Sharma', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '11:00 AM', status: 'Scheduled', shopId: 'SHOP002' },
    { id: 'APP003', patientId: 'PAT003', patientName: 'Anjali Singh', doctorName: 'Dr. Sunita Gupta', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '02:00 PM', status: 'Scheduled', shopId: 'SHOP001' },
    { id: 'APP004', patientId: 'PAT004', patientName: 'Vikram Kumar', doctorName: 'Dr. Meena Iyer', date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), time: '09:00 AM', status: 'Scheduled', shopId: 'SHOP002' },
    { id: 'APP005', patientId: 'PAT005', patientName: 'Sunita Patil', doctorName: 'Dr. Ramesh Sharma', date: format(addDays(new Date(), 5), 'yyyy-MM-dd'), time: '03:00 PM', status: 'Scheduled', shopId: 'SHOP001' },
];

export const doctors: Doctor[] = [
    { id: 'DOC001', name: 'Dr. Sunita Gupta', email: 'doctor@example.com', lastLogin: '2024-05-20 11:00 AM' },
    { id: 'DOC002', name: 'Dr. Ramesh Sharma', email: 'doctor2@example.com', lastLogin: '2024-05-21 09:30 AM'},
    { id: 'DOC003', name: 'Dr. Meena Iyer', email: 'doctor3@example.com', lastLogin: '2024-05-21 09:30 AM' },
];

export const songs: Song[] = [
    {
        title: "Awaiting on You All",
        artist: "George Harrison",
        albumArtUrl: "https://picsum.photos/seed/song1/300/300",
        audioSrc: "https://storage.googleapis.com/studiopush-public/assets/audio/5-02%20Awaiting%20on%20You%20All.mp3"
    },
    {
        title: "All Things Must Pass",
        artist: "George Harrison",
        albumArtUrl: "https://picsum.photos/seed/song2/300/300",
        audioSrc: "https://storage.googleapis.com/studiopush-public/assets/audio/1-10%20All%20Things%20Must%20Pass.mp3"
    },
    {
        title: "Isn't It a Pity",
        artist: "George Harrison",
        albumArtUrl: "https://picsum.photos/seed/song3/300/300",
        audioSrc: "https://storage.googleapis.com/studiopush-public/assets/audio/1-07%20Isn't%20It%20a%20Pity.mp3"
    }
];


export const admins = [
    { name: 'Admin User', email: 'admin@example.com', lastLogin: '2024-05-22 09:00 AM' },
];


export const adminPaymentNotices: AdminPaymentNotice[] = [
    {
        adminEmail: 'admin@example.com',
        amountDue: 250,
        dueDate: addDays(new Date(), -5).toISOString(), // 5 days overdue
        lockOnExpire: true,
        status: 'pending',
    }
]
