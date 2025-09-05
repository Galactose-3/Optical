var express = require('express');
var router = express.Router();

// Mock data - in a real app, this would come from a database
const patients = [
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

const products = [
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

const invoices = [
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

const purchaseOrders = [
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

const appointments = [
    { id: 'APP001', patientId: 'PAT001', patientName: 'Priya Sharma', doctorName: 'Dr. Sunita Gupta', date: new Date().toISOString().split('T')[0], time: '10:00 AM', status: 'Scheduled', shopId: 'SHOP001' },
    { id: 'APP002', patientId: 'PAT002', patientName: 'Rohan Mehta', doctorName: 'Dr. Ramesh Sharma', date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], time: '11:00 AM', status: 'Scheduled', shopId: 'SHOP002' },
    { id: 'APP003', patientId: 'PAT003', patientName: 'Anjali Singh', doctorName: 'Dr. Sunita Gupta', date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], time: '02:00 PM', status: 'Scheduled', shopId: 'SHOP001' },
    { id: 'APP004', patientId: 'PAT004', patientName: 'Vikram Kumar', doctorName: 'Dr. Meena Iyer', date: new Date(Date.now() + 4*24*60*60*1000).toISOString().split('T')[0], time: '09:00 AM', status: 'Scheduled', shopId: 'SHOP002' },
    { id: 'APP005', patientId: 'PAT005', patientName: 'Sunita Patil', doctorName: 'Dr. Ramesh Sharma', date: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0], time: '03:00 PM', status: 'Scheduled', shopId: 'SHOP001' },
];

const shops = [
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
];

const doctors = [
    { id: 'DOC001', name: 'Dr. Sunita Gupta', email: 'doctor@example.com', lastLogin: '2024-05-20 11:00 AM' },
    { id: 'DOC002', name: 'Dr. Ramesh Sharma', email: 'doctor2@example.com', lastLogin: '2024-05-21 09:30 AM'},
    { id: 'DOC003', name: 'Dr. Meena Iyer', email: 'doctor3@example.com', lastLogin: '2024-05-21 09:30 AM' },
];

const admins = [
    { name: 'Admin User', email: 'admin@example.com', lastLogin: '2024-05-22 09:00 AM' },
];

const staff = [
    { name: 'Raj Patel', email: 'staff@example.com', lastLogin: '2024-05-20 10:00 AM' },
];

const adminPaymentNotices = [
    {
        adminEmail: 'admin@example.com',
        amountDue: 250,
        dueDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        lockOnExpire: true,
        status: 'pending',
    }
];

// API Routes
router.get('/patients', function(req, res) {
  res.json(patients);
});

router.get('/products', function(req, res) {
  res.json(products);
});

router.get('/invoices', function(req, res) {
  res.json(invoices);
});

router.get('/purchase-orders', function(req, res) {
  res.json(purchaseOrders);
});

router.get('/appointments', function(req, res) {
  res.json(appointments);
});

router.get('/shops', function(req, res) {
  res.json(shops);
});

router.get('/doctors', function(req, res) {
  res.json(doctors);
});

router.get('/admins', function(req, res) {
  res.json(admins);
});

router.get('/staff', function(req, res) {
  res.json(staff);
});

router.get('/admin-payment-notices', function(req, res) {
  res.json(adminPaymentNotices);
});

// -------------------------------------------------------------
// Additional Endpoints: Customers, Prescriptions, Walk-in Invoice
// -------------------------------------------------------------

// In-memory stores
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

function paginate(list, page = 1, limit = 10) {
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.max(parseInt(limit) || 10, 1);
  const start = (p - 1) * l;
  const end = start + l;
  const total = list.length;
  const totalPages = Math.max(Math.ceil(total / l), 1);
  return { data: list.slice(start, end), total, page: p, totalPages };
}

// Create Customer
router.post('/customer', function(req, res) {
  const { name, phone, address } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const now = new Date().toISOString();
  const customer = { id: nextIds.customer++, name, phone, address, createdAt: now, updatedAt: now };
  customers.push(customer);
  res.status(201).json(customer);
});

// Get All Customers with pagination and optional search
router.get('/customer', function(req, res) {
  const { page = '1', limit = '10', search = '' } = req.query;
  const s = String(search).toLowerCase();
  const filtered = s ? customers.filter(c => c.name.toLowerCase().includes(s)) : customers;
  const { data, total, totalPages, page: p } = paginate(filtered, page, limit);
  res.json({ customers: data, total, page: p, totalPages });
});

// Get Single Customer with invoices
router.get('/customer/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const customer = customers.find(c => c.id === id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  // Map demo invoices for this customer from existing invoices mock by name or patientId if present
  const relatedInvoices = invoices
    .filter(inv => inv.patientName === customer.name || inv.patientId === String(id))
    .map(inv => ({
      id: inv.id,
      totalAmount: inv.total,
      status: inv.status?.toUpperCase?.() || 'PAID',
      items: inv.items?.map(it => ({
        id: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        product: { name: it.productName },
      })) || [],
    }));
  res.json({ id: customer.id, name: customer.name, phone: customer.phone, address: customer.address, invoices: relatedInvoices });
});

// Hotspots aggregation (demo)
router.get('/customer/hotspots', function(req, res) {
  const hotspots = [
    { address: 'Main Street', customerCount: 15 },
    { address: 'Oak Avenue', customerCount: 12 },
  ];
  res.json(hotspots);
});

// Create Patient (basic - no auth enforcement for now)
router.post('/patient', function(req, res) {
  const { name, age, gender, phone, address, medicalHistory } = req.body || {};
  if (!name || !age || !gender) return res.status(400).json({ error: 'name, age, gender are required' });
  const newId = `PAT${String(patients.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const patient = { id: newId, name, email: '', phone: phone || '', address: { city: address || '', state: '' }, insuranceProvider: '', insurancePolicyNumber: '', prescription: { sphere: { right: 0, left: 0 }, cylinder: { right: 0, left: 0 }, axis: { right: 0, left: 0 }, add: { right: 0, left: 0 } }, lastVisit: now, shopId: 'SHOP001' };
  patients.push(patient);
  res.status(201).json({ id: patients.length, name, age, gender, phone, address, medicalHistory });
});

// Create Prescription
router.post('/prescription', function(req, res) {
  const { patientId, rightEye, leftEye } = req.body || {};
  if (!patientId || !rightEye || !leftEye) return res.status(400).json({ error: 'patientId, rightEye, leftEye are required' });
  const now = new Date().toISOString();
  const record = { id: nextIds.prescription++, patientId: Number(patientId), rightEye, leftEye, createdAt: now, updatedAt: now };
  prescriptions.push(record);
  const patient = patients.find(p => p.id === String(patientId)) || null;
  res.status(201).json({ ...record, patient: patient ? { id: patientId, name: patient.name } : undefined });
});

// Get All Prescriptions (pagination + optional patientId filter)
router.get('/prescription', function(req, res) {
  const { page = '1', limit = '10', patientId } = req.query;
  const list = patientId ? prescriptions.filter(pr => String(pr.patientId) === String(patientId)) : prescriptions;
  const { data, total, totalPages, page: p } = paginate(list, page, limit);
  const enriched = data.map(pr => {
    const patient = patients.find(pt => String(pt.id) === String(pr.patientId));
    return { ...pr, patient: patient ? { id: pr.patientId, name: patient.name } : undefined };
  });
  res.json({ prescriptions: enriched, total, page: p, totalPages });
});

// Get Single Prescription
router.get('/prescription/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const pr = prescriptions.find(x => x.id === id);
  if (!pr) return res.status(404).json({ error: 'Prescription not found' });
  const patient = patients.find(pt => String(pt.id) === String(pr.patientId));
  res.json({ ...pr, patient: patient ? { id: pr.patientId, name: patient.name } : undefined });
});

// Create Customer + Invoice (Walk-in)
router.post('/customer/invoice', function(req, res) {
  const { customer, items, paymentMethod = 'cash', staffId = 1, paidAmount = 0, discount = 0 } = req.body || {};
  if (!customer || !Array.isArray(items)) return res.status(400).json({ error: 'customer and items are required' });

  // Create or reuse customer
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

  // Create a simple invoice summary
  const totalAmount = items.reduce((sum, it) => sum + (Number(it.unitPrice) * Number(it.quantity || 1)), 0) - Number(discount || 0);
  const invoice = {
    id: 'INV-' + Date.now(),
    staffId,
    paymentMethod,
    paidAmount,
    totalAmount,
    status: paidAmount >= totalAmount ? 'PAID' : 'UNPAID',
    items: items.map((it, idx) => ({ id: idx + 1, quantity: it.quantity || 1, unitPrice: Number(it.unitPrice) || 0, product: { name: it.product?.name || 'Item' } })),
    createdAt: now,
    updatedAt: now,
    customer: createdCustomer,
  };

  res.status(201).json(invoice);
});

module.exports = router;