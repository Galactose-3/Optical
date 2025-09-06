var express = require('express');
var router = express.Router();

// -----------------------------
// Mock Data Stores
// -----------------------------
const patients = [
  {
    id: 'PAT001',
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let customers = [
  {
    id: 1,
    name: 'Jane Smith',
    phone: '+91-9876543210',
    address: '456 Oak Ave, Sometown, USA',
    createdAt: new Date('2025-09-04T10:30:00.000Z').toISOString(),
    updatedAt: new Date('2025-09-04T10:30:00.000Z').toISOString(),
  },
];

let prescriptions = [
  {
    id: 1,
    patientId: 1,
    rightEye: { sph: -1.25, cyl: -0.5, axis: 180, add: 0, pd: 32, bc: 8.6 },
    leftEye: { sph: -1.5, cyl: -0.75, axis: 170, add: 0, pd: 32, bc: 8.6 },
    createdAt: new Date('2025-09-04T10:35:00.000Z').toISOString(),
    updatedAt: new Date('2025-09-04T10:35:00.000Z').toISOString(),
  },
];

let nextIds = { customer: 2, prescription: 2 };

// -----------------------------
// Helper Functions
// -----------------------------
function paginate(list, page = 1, limit = 10) {
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.max(parseInt(limit) || 10, 1);
  const start = (p - 1) * l;
  const end = start + l;
  const total = list.length;
  const totalPages = Math.max(Math.ceil(total / l), 1);
  return { data: list.slice(start, end), total, page: p, totalPages };
}

// -----------------------------
// Auth Middleware
// -----------------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing Bearer Token' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'mysecrettoken') {
    return res.status(403).json({ error: 'Forbidden: Invalid Token' });
  }
  next();
}

// -----------------------------
// Customer Endpoints
// -----------------------------
router.post('/customer', function (req, res) {
  const { name, phone, address } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const now = new Date().toISOString();
  const customer = { id: nextIds.customer++, name, phone, address, createdAt: now, updatedAt: now };
  customers.push(customer);
  res.status(201).json(customer);
});

router.get('/customer', function (req, res) {
  const { page = '1', limit = '10', search = '' } = req.query;
  const s = String(search).toLowerCase();
  const filtered = s ? customers.filter(c => c.name.toLowerCase().includes(s)) : customers;
  const { data, total, totalPages, page: p } = paginate(filtered, page, limit);
  res.json({ customers: data, total, page: p, totalPages });
});

router.get('/customer/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const customer = customers.find(c => c.id === id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json({ ...customer, invoices: [] });
});

router.get('/customer/hotspots', function (req, res) {
  res.json([
    { address: 'Main Street', customerCount: 15 },
    { address: 'Oak Avenue', customerCount: 12 },
  ]);
});

router.post('/customer/invoice', function (req, res) {
  const { customer, items, paymentMethod = 'cash', staffId = 1, paidAmount = 0, discount = 0 } = req.body || {};
  if (!customer || !Array.isArray(items)) return res.status(400).json({ error: 'customer and items are required' });

  const now = new Date().toISOString();
  const createdCustomer = {
    id: nextIds.customer++,
    name: customer.name || 'Walk-in Customer',
    phone: customer.phone || '',
    address: customer.address || '',
    createdAt: now,
    updatedAt: now,
  };
  customers.push(createdCustomer);

  const totalAmount = items.reduce((sum, it) => sum + (Number(it.unitPrice) * Number(it.quantity || 1)), 0) - Number(discount || 0);

  const invoice = {
    id: 'INV-' + Date.now(),
    staffId,
    paymentMethod,
    paidAmount,
    totalAmount,
    status: paidAmount >= totalAmount ? 'PAID' : 'UNPAID',
    items: items.map((it, idx) => ({
      id: idx + 1,
      quantity: it.quantity || 1,
      unitPrice: Number(it.unitPrice) || 0,
      product: { name: it.product?.name || 'Item' },
    })),
    createdAt: now,
    updatedAt: now,
    customer: createdCustomer,
  };

  res.status(201).json(invoice);
});

// -----------------------------
// Patient Endpoints
// -----------------------------
router.post('/patient', authMiddleware, function (req, res) {
  const { name, age, gender, phone, address, medicalHistory } = req.body || {};
  if (!name || !age || !gender) return res.status(400).json({ error: 'name, age, gender are required' });

  const now = new Date().toISOString();
  const newId = patients.length + 1;
  const patient = {
    id: newId,
    name,
    age,
    gender,
    phone: phone || '',
    address: address || '',
    medicalHistory: medicalHistory || '',
    createdAt: now,
    updatedAt: now,
  };
  patients.push(patient);
  res.status(201).json(patient);
});

// -----------------------------
// Prescription Endpoints
// -----------------------------
router.post('/prescription', function (req, res) {
  const { patientId, rightEye, leftEye } = req.body || {};
  if (!patientId || !rightEye || !leftEye) return res.status(400).json({ error: 'patientId, rightEye, leftEye are required' });

  const now = new Date().toISOString();
  const record = { id: nextIds.prescription++, patientId: Number(patientId), rightEye, leftEye, createdAt: now, updatedAt: now };
  prescriptions.push(record);

  const patient = patients.find(p => String(p.id) === String(patientId));
  res.status(201).json({ ...record, patient: patient ? { id: patientId, name: patient.name } : undefined });
});

router.get('/prescription', function (req, res) {
  const { page = '1', limit = '10', patientId } = req.query;
  const list = patientId ? prescriptions.filter(pr => String(pr.patientId) === String(patientId)) : prescriptions;
  const { data, total, totalPages, page: p } = paginate(list, page, limit);
  const enriched = data.map(pr => {
    const patient = patients.find(pt => String(pt.id) === String(pr.patientId));
    return {
      ...pr,
      patient: patient ? { id: pr.patientId, name: patient.name, age: patient.age, gender: patient.gender } : undefined,
    };
  });
  res.json({ prescriptions: enriched, total, page: p, totalPages });
});

router.get('/prescription/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const pr = prescriptions.find(x => x.id === id);
  if (!pr) return res.status(404).json({ error: 'Prescription not found' });

  const patient = patients.find(pt => String(pt.id) === String(pr.patientId));
  res.json({
    ...pr,
    patient: patient ? { id: pr.patientId, name: patient.name, age: patient.age, gender: patient.gender } : undefined,
  });
});

module.exports = router;
