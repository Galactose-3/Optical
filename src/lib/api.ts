
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


export async function getPatients(): Promise<Patient[]> {
    return fetchData<Patient[]>('patients');
}

export async function getProducts(): Promise<Product[]> {
    return fetchData<Product[]>('products');
}

export async function getInvoices(): Promise<Invoice[]> {
    return fetchData<Invoice[]>('invoices');
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return fetchData<PurchaseOrder[]>('purchase-orders');
}

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
