/**
 * @file This file contains functions to fetch data from the API endpoints.
 * It provides a clean interface for the frontend components to interact
 * with the backend.
 */

import type { Patient, Product, Invoice, PurchaseOrder, Appointment, Shop, Song, AdminPaymentNotice, Doctor } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper function to fetch data from the API
async function fetchData<T>(endpoint: string): Promise<T> {
    // In a real app, you would fetch from your domain
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/${endpoint}`);

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Failed to fetch ${endpoint}`);
    }

    // Adding a small delay to simulate network latency
    await delay(Math.random() * 500 + 100);

    return res.json();
}

// Helper function for POST requests
async function postData<T>(endpoint: string, data: any): Promise<T> {
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`Failed to post to ${endpoint}`);
    }

    await delay(Math.random() * 500 + 100);
    return res.json();
}

export async function getPatients(): Promise<Patient[]> {
     return fetchData<Patient[]>('patients');
 }

export async function getProduct(): Promise<Product[]> {
    return fetchData<Product[]>('products');
}

// Alias for components that expect getProducts
export const getProducts = getProduct;

export async function getInvoice(): Promise<Invoice[]> {
    return fetchData<Invoice[]>('invoices');
}

// Alias for components that expect getInvoices
export const getInvoices = getInvoice;

export async function getPurchaseOrder(): Promise<PurchaseOrder[]> {
    return fetchData<PurchaseOrder[]>('purchase-orders');
}

// Alias for components that expect getPurchaseOrders
export const getPurchaseOrders = getPurchaseOrder;

export async function getAppointments(): Promise<Appointment[]> {
    return fetchData<Appointment[]>('appointments');
}

export async function getShops(): Promise<Shop[]> {
    return fetchData<Shop[]>('shops');
}

export async function getAdminPaymentNotices(): Promise<AdminPaymentNotice[]> {
    return fetchData<AdminPaymentNotice[]>('admin-payment-notices');
}

export async function getDoctors(): Promise<Doctor[]> {
    return fetchData<Doctor[]>('doctors');
}

export async function getAdmins() {
    return fetchData<any[]>('admins');
}

export async function getStaff() {
    return fetchData<any[]>('staff');
}

// Example of a POST request simulation
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    console.log('Simulating create new product...', productData);
    // In a real app, this would be a POST request
    // const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(productData) });
    // const newProduct = await res.json();
    // return newProduct;
    await delay(500);
    const newProduct: Product = {
        id: `PROD-${Date.now()}`,
        ...productData
    };
    // Note: This only adds to the in-memory mock data for the demo.
    // A real backend would persist this.
    return newProduct;
}

// -------------------------------------------------------------
// New API Functions for Customer, Prescription, Patient, Walk-in Invoice
// -------------------------------------------------------------

// Customer API functions
export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerWithInvoices extends Customer {
    invoices: Array<{
        id: string;
        totalAmount: number;
        status: string;
        items: Array<{
            id: string;
            quantity: number;
            unitPrice: number;
            product: { name: string };
        }>;
    }>;
}

export interface CustomerListResponse {
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
}

export async function createCustomer(customerData: { name: string; phone?: string; address?: string }): Promise<Customer> {
    return postData<Customer>('customer', customerData);
}

export async function getCustomers(params?: { page?: number; limit?: number; search?: string }): Promise<CustomerListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `customer?${queryString}` : 'customer';
    return fetchData<CustomerListResponse>(endpoint);
}

export async function getCustomer(id: number): Promise<CustomerWithInvoices> {
    return fetchData<CustomerWithInvoices>(`customer/${id}`);
}

export async function getCustomerHotspots(): Promise<Array<{ address: string; customerCount: number }>> {
    return fetchData<Array<{ address: string; customerCount: number }>>('customer/hotspots');
}

// Prescription API functions
export interface PrescriptionEye {
    sph: number;
    cyl: number;
    axis: number;
    add: number;
    pd: number;
    bc: number;
}

export interface Prescription {
    id: number;
    patientId: number;
    rightEye: PrescriptionEye;
    leftEye: PrescriptionEye;
    createdAt: string;
    updatedAt: string;
    patient?: { id: number; name: string };
}

export interface PrescriptionListResponse {
    prescriptions: Prescription[];
    total: number;
    page: number;
    totalPages: number;
}

export async function createPrescription(prescriptionData: {
    patientId: number;
    rightEye: PrescriptionEye;
    leftEye: PrescriptionEye;
}): Promise<Prescription> {
    return postData<Prescription>('prescription', prescriptionData);
}

export async function getPrescriptions(params?: { page?: number; limit?: number; patientId?: number }): Promise<PrescriptionListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.patientId) searchParams.append('patientId', params.patientId.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `prescription?${queryString}` : 'prescription';
    return fetchData<PrescriptionListResponse>(endpoint);
}

export async function getPrescription(id: number): Promise<Prescription> {
    return fetchData<Prescription>(`prescription/${id}`);
}

// Patient API functions
export interface NewPatient {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    medicalHistory?: string;
}

export interface PatientResponse {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    medicalHistory?: string;
}

export async function createPatient(patientData: NewPatient): Promise<PatientResponse> {
    return postData<PatientResponse>('patient', patientData);
}

// Walk-in Invoice API functions
export interface WalkInInvoiceItem {
    productId: number;
    quantity: number;
    unitPrice: number;
    product?: { name: string };
}

export interface WalkInInvoiceRequest {
    customer: {
        name: string;
        phone?: string;
        address?: string;
    };
    items: WalkInInvoiceItem[];
    paymentMethod?: string;
    staffId?: number;
    paidAmount?: number;
    discount?: number;
}

export interface WalkInInvoiceResponse {
    id: string;
    staffId: number;
    paymentMethod: string;
    paidAmount: number;
    totalAmount: number;
    status: string;
    items: Array<{
        id: number;
        quantity: number;
        unitPrice: number;
        product: { name: string };
    }>;
    createdAt: string;
    updatedAt: string;
    customer: Customer;
}

export async function createWalkInInvoice(invoiceData: WalkInInvoiceRequest): Promise<WalkInInvoiceResponse> {
    return postData<WalkInInvoiceResponse>('customer/invoice', invoiceData);
}
