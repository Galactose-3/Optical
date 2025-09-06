const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Customer Management
export async function createCustomer(data) {
  const res = await fetch(`${baseUrl}/api/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return await res.json();
}

export async function getCustomers({ page = 1, limit = 10, search = "" } = {}) {
  const res = await fetch(`${baseUrl}/api/customer?page=${page}&limit=${limit}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return await res.json();
}

export async function getCustomerById(id) {
  const res = await fetch(`${baseUrl}/api/customer/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return await res.json();
}

export async function createCustomerWithInvoice(data) {
  const res = await fetch(`${baseUrl}/api/customer/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer with invoice");
  return await res.json();
}

export async function getCustomerHotspots() {
  const res = await fetch(`${baseUrl}/api/customer/hotspots`);
  if (!res.ok) throw new Error("Failed to fetch customer hotspots");
  return await res.json();
}

// Patient Management
export async function createPatient(data) {
  const res = await fetch(`${baseUrl}/api/patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  return await res.json();
}

export async function getPatients({ page = 1, limit = 10, search = "" } = {}) {
  console.log('Fetching patients from:', `${baseUrl}/api/patient?page=${page}&limit=${limit}&search=${search}`);
  try {
    const res = await fetch(`${baseUrl}/api/patient?page=${page}&limit=${limit}&search=${search}`);
    console.log('Patients fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch patients");
    const data = await res.json();
    console.log('Patients data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getPatientById(id) {
  const res = await fetch(`${baseUrl}/api/patient/${id}`);
  if (!res.ok) throw new Error("Failed to fetch patient");
  return await res.json();
}

// Prescription Management
export async function createPrescription(data) {
  const res = await fetch(`${baseUrl}/api/prescription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create prescription");
  return await res.json();
}

export async function getPrescriptions({ page = 1, limit = 10, patientId } = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (patientId) params.append('patientId', patientId.toString());

  const res = await fetch(`${baseUrl}/api/prescription?${params}`);
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  return await res.json();
}

export async function getPrescriptionById(id) {
  const res = await fetch(`${baseUrl}/api/prescription/${id}`);
  if (!res.ok) throw new Error("Failed to fetch prescription");
  return await res.json();
}

// Additional functions for existing components compatibility
export async function getInvoices() {
  console.log('Fetching invoices from:', `${baseUrl}/api/invoices`);
  try {
    const res = await fetch(`${baseUrl}/api/invoices`);
    console.log('Invoices fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch invoices");
    const data = await res.json();
    console.log('Invoices data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

export async function getProducts() {
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function getPurchaseOrders() {
  const res = await fetch(`${baseUrl}/api/purchase-orders`);
  if (!res.ok) throw new Error("Failed to fetch purchase orders");
  return await res.json();
}

export async function getShops() {
  const res = await fetch(`${baseUrl}/api/shops`);
  if (!res.ok) throw new Error("Failed to fetch shops");
  return await res.json();
}

export async function getAppointments() {
  console.log('Fetching appointments from:', `${baseUrl}/api/appointments`);
  try {
    const res = await fetch(`${baseUrl}/api/appointments`);
    console.log('Appointments fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch appointments");
    const data = await res.json();
    console.log('Appointments data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function getAdmins() {
  const res = await fetch(`${baseUrl}/api/admins`);
  if (!res.ok) throw new Error("Failed to fetch admins");
  return await res.json();
}

export async function getStaff() {
  console.log('Fetching staff from:', `${baseUrl}/api/staff`);
  try {
    const res = await fetch(`${baseUrl}/api/staff`);
    console.log('Staff fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch staff");
    const data = await res.json();
    console.log('Staff data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
}

export async function getDoctors() {
  console.log('Fetching doctors from:', `${baseUrl}/api/doctors`);
  try {
    const res = await fetch(`${baseUrl}/api/doctors`);
    console.log('Doctors fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch doctors");
    const data = await res.json();
    console.log('Doctors data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getAdminPaymentNotices() {
  console.log('Fetching admin payment notices from:', `${baseUrl}/api/admin-payment-notices`);
  try {
    const res = await fetch(`${baseUrl}/api/admin-payment-notices`);
    console.log('Admin payment notices fetch response status:', res.status);
    if (!res.ok) throw new Error("Failed to fetch admin payment notices");
    const data = await res.json();
    console.log('Admin payment notices data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin payment notices:', error);
    throw error;
  }
}

// Aliases for backward compatibility
export const getProduct = getProducts;
export const getInvoice = getInvoices;
