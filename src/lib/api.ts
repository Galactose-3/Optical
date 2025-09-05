/**
 * @file This file contains functions to fetch data from the API endpoints.
 * It provides a clean interface for the frontend components to interact
 * with the backend.
 */

import type { Patient, Product, Invoice, PurchaseOrder, Appointment, Shop, Song, AdminPaymentNotice, Doctor } from './types';

// 🔑 Auth token (configure in .env as VITE_API_TOKEN)
const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || 'mysecrettoken';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper function to fetch data from the API
async function fetchData<T>(endpoint: string, requiresAuth = false): Promise<T> {
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ||
                    (import.meta.env.PROD ? 'https://staff-optical-production.up.railway.app' : 'http://localhost:3000');

    console.log(`🔗 API Request: ${baseUrl}/api/${endpoint}`);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    const res = await fetch(`${baseUrl}/api/${endpoint}`, { headers });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ API Error [${res.status}]: ${endpoint}`, errorText);
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
    }

    await delay(Math.random() * 500 + 100);

    const data = await res.json();
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;
}

// Helper function for POST requests
async function postData<T>(endpoint: string, data: any, requiresAuth = false): Promise<T> {
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ||
                    (import.meta.env.PROD ? 'https://staff-optical-production.up.railway.app' : 'http://localhost:3000');

    console.log(`📤 API POST Request: ${baseUrl}/api/${endpoint}`, data);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ API POST Error [${res.status}]: ${endpoint}`, errorText);
        throw new Error(`Failed to post to ${endpoint}: ${res.status} ${res.statusText}`);
    }

    await delay(Math.random() * 500 + 100);
    const responseData = await res.json();
    console.log(`✅ API POST Success: ${endpoint}`, responseData);
    return responseData;
}

// -----------------------------
// Patients
// -----------------------------
export async function getPatients(): Promise<Patient[]> {
     return fetchData<Patient[]>('patients');
}

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
    createdAt: string;
    updatedAt: string;
}

export async function createPatient(patientData: NewPatient): Promise<PatientResponse> {
    return postData<PatientResponse>('patient', patientData, true); // requires auth
}

// -----------------------------
// Products
// -----------------------------
export async function getProduct(): Promise<Product[]> {
    return fetchData<Product[]>('products');
}
export const getProducts = getProduct;

// -----------------------------
// Invoices
// -----------------------------
export async function getInvoice(): Promise<Invoice[]> {
    return fetchData<Invoice[]>('invoices');
}
export const getInvoices = getInvoice;

// -----------------------------
// Purchase Orders
// -----------------------------
export async function getPurchaseOrder(): Promise<PurchaseOrder[]> {
    return fetchData<PurchaseOrder[]>('purchase-orders');
}
export const getPurchaseOrders = getPurchaseOrder;

// -----------------------------
// Appointments
// -----------------------------
export async function getAppointments(): Promise<Appointment[]> {
    return fetchData<Appointment[]>('appointments');
}

// -----------------------------
// Shops
// -----------------------------
export async function getShops(): Promise<Shop[]> {
    return fetchData<Shop[]>('shops');
}

// -----------------------------
// Admin
// -----------------------------
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

// -----------------------------
// Customers
// -----------------------------
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

// -----------------------------
// Prescriptions
// -----------------------------
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
    patient?: { id: number; name: string; age?: number; gender?: string };
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

// -----------------------------
// Walk-in Invoice
// -----------------------------
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
