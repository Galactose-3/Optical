/**
 * @file This file contains functions to fetch data from the API endpoints.
 * It provides a clean interface for the frontend components to interact
 * with the backend.
 */

// 🔑 Auth token (configure in .env as VITE_API_TOKEN)
const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || 'mysecrettoken';

// Simulate network delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Enhanced error handling and retry logic
class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

// Helper function to fetch data from the API with retry logic
async function fetchData(endpoint, requiresAuth = false, retries = 3) {
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ||
                    (import.meta.env.PROD ? 'https://staff-optical-production.up.railway.app' : 'http://localhost:3000');

    console.log(`🔗 API Request: ${baseUrl}/api/${endpoint}`);

    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(`${baseUrl}/api/${endpoint}`, { 
                headers,
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`❌ API Error [${res.status}]: ${endpoint}`, errorText);
                
                if (attempt === retries) {
                    throw new ApiError(
                        `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`,
                        res.status,
                        endpoint
                    );
                }
                
                // Wait before retry (exponential backoff)
                await delay(Math.pow(2, attempt) * 1000);
                continue;
            }

            await delay(Math.random() * 500 + 100);
            const data = await res.json();
            console.log(`✅ API Success: ${endpoint}`, data);
            return data;
        } catch (error) {
            if (attempt === retries) {
                if (error instanceof ApiError) throw error;
                throw new ApiError(
                    `Network error for ${endpoint}: ${error.message}`,
                    0,
                    endpoint
                );
            }
            await delay(Math.pow(2, attempt) * 1000);
        }
    }
}

// Helper function for POST requests
async function postData(endpoint, data, requiresAuth = false) {
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ||
                    (import.meta.env.PROD ? 'https://staff-optical-production.up.railway.app' : 'http://localhost:3000');

    console.log(`📤 API POST Request: ${baseUrl}/api/${endpoint}`, data);

    const headers = {
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
export async function getPatients() {
     return fetchData('patients');
}

export async function createPatient(patientData) {
    return postData('patient', patientData, true); // requires auth
}

// -----------------------------
// Products
// -----------------------------
export async function getProduct() {
    return fetchData('products');
}
export const getProducts = getProduct;

// -----------------------------
// Invoices
// -----------------------------
export async function getInvoice() {
    return fetchData('invoices');
}
export const getInvoices = getInvoice;

// -----------------------------
// Purchase Orders
// -----------------------------
export async function getPurchaseOrder() {
    return fetchData('purchase-orders');
}
export const getPurchaseOrders = getPurchaseOrder;

// -----------------------------
// Appointments
// -----------------------------
export async function getAppointments() {
    return fetchData('appointments');
}

// -----------------------------
// Shops
// -----------------------------
export async function getShops() {
    return fetchData('shops');
}

// -----------------------------
// Admin
// -----------------------------
export async function getAdminPaymentNotices() {
    return fetchData('admin-payment-notices');
}

export async function getDoctors() {
    return fetchData('doctors');
}

export async function getAdmins() {
    return fetchData('admins');
}

export async function getStaff() {
    return fetchData('staff');
}

// -----------------------------
// Customers
// -----------------------------
export async function createCustomer(customerData) {
    return postData('customer', customerData);
}

export async function getCustomers(params) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `customer?${queryString}` : 'customer';
    return fetchData(endpoint);
}

export async function getCustomer(id) {
    return fetchData(`customer/${id}`);
}

export async function getCustomerHotspots() {
    return fetchData('customer/hotspots');
}

// -----------------------------
// Prescriptions
// -----------------------------
export async function createPrescription(prescriptionData) {
    return postData('prescription', prescriptionData);
}

export async function getPrescriptions(params) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.patientId) searchParams.append('patientId', params.patientId.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `prescription?${queryString}` : 'prescription';
    return fetchData(endpoint);
}

export async function getPrescription(id) {
    return fetchData(`prescription/${id}`);
}

// -----------------------------
// Walk-in Invoice
// -----------------------------
export async function createWalkInInvoice(invoiceData) {
    return postData('customer/invoice', invoiceData);
}
