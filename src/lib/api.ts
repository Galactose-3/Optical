// api.ts

const BASE_URL = "https://staff-optical-production.up.railway.app/api";

/**
 * Generic fetch wrapper with error handling
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("❌ API request failed:", error);
        throw error;
    }
}

//
// =====================
// CUSTOMER ENDPOINTS
// =====================
//

export function createCustomer(data: {
    name: string;
    phone: string;
    address: string;
}) {
    return request(`${BASE_URL}/customer`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getCustomers(page = 1, limit = 10, search = "") {
    return request(
        `${BASE_URL}/customer?page=${page}&limit=${limit}&search=${search}`
    );
}

export function getCustomer(id: number) {
    return request(`${BASE_URL}/customer/${id}`);
}

export function createCustomerWithInvoice(data: any) {
    return request(`${BASE_URL}/customer/invoice`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getCustomerHotspots() {
    return request(`${BASE_URL}/customer/hotspots`);
}

//
// =====================
// PATIENT ENDPOINTS
// =====================
//

export function createPatient(data: {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    medicalHistory?: string;
}) {
    return request(`${BASE_URL}/patient`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getPatients(page = 1, limit = 10) {
    return request(`${BASE_URL}/patient?page=${page}&limit=${limit}`);
}

export function getPatient(id: number) {
    return request(`${BASE_URL}/patient/${id}`);
}

//
// =====================
// PRESCRIPTION ENDPOINTS
// =====================
//

export function createPrescription(data: any) {
    return request(`${BASE_URL}/prescription`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getPrescriptions(patientId: number, page = 1, limit = 10) {
    return request(
        `${BASE_URL}/prescription?page=${page}&limit=${limit}&patientId=${patientId}`
    );
}

export function getPrescription(id: number) {
    return request(`${BASE_URL}/prescription/${id}`);
}
