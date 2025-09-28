// ERP service simulation with robust domain logic

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Branch master with simple geo/region data
const branches = [
  {
    id: 'BR01',
    name: 'Main Warehouse',
    address: '123 Herbal Park, Industrial Area',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385, lon: 78.4867,
    pincodePrefixes: ['50', '51'],
  },
  {
    id: 'BR02',
    name: 'Jubilee Hills Branch',
    address: 'Plot 8, Road 36, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.441, lon: 78.393,
    pincodePrefixes: ['50'],
  },
  {
    id: 'BR03',
    name: 'Banjara Hills Branch',
    address: 'Road No. 12, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.415, lon: 78.448,
    pincodePrefixes: ['50'],
  },
  {
    id: 'BR04',
    name: 'Vijayawada Branch',
    address: 'MG Road, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    lat: 16.506, lon: 80.648,
    pincodePrefixes: ['52'],
  },
];

// Product and inventory master
const products = [
  {
    id: 'P-MAN-001',
    name: 'Ashwagandha Tablets 60s',
    sku: 'ASHWA-60',
    type: 'manufactured',
    hsn: '30049011',
    dosage: '1–2 tablets twice daily with warm water or as directed by physician.',
    bmrCode: 'BMR-ASHWA',
    vendor: null,
    batches: [
      { batchNo: 'ASW2409A', mfgDate: '2024-09-05', expDate: '2026-09-04', totalQty: 800, branchStock: { BR01: 400, BR02: 200, BR03: 100, BR04: 100 } },
      { batchNo: 'ASW2412B', mfgDate: '2024-12-10', expDate: '2026-12-09', totalQty: 500, branchStock: { BR01: 300, BR02: 100, BR03: 50, BR04: 50 } },
    ],
    fcp: 120,
    marginPct: 35,
  },
  {
    id: 'P-MAN-002',
    name: 'Triphala Churna 200g',
    sku: 'TRI-200',
    type: 'manufactured',
    hsn: '30049013',
    dosage: '1 teaspoon at bedtime with lukewarm water or as directed by physician.',
    bmrCode: 'BMR-TRI',
    vendor: null,
    batches: [
      { batchNo: 'TRI2408A', mfgDate: '2024-08-15', expDate: '2026-08-14', totalQty: 600, branchStock: { BR01: 250, BR02: 150, BR03: 100, BR04: 100 } },
    ],
    fcp: 95,
    marginPct: 40,
  },
  {
    id: 'P-RES-001',
    name: 'Zandu Balm 8ml',
    sku: 'ZB-8',
    type: 'resale',
    hsn: '30049029',
    dosage: 'For external use only. Apply gently on affected area.',
    bmrCode: null,
    vendor: 'Emami Ltd (Zandu)',
    batches: [
      { batchNo: 'ZB2410', mfgDate: '2024-10-01', expDate: '2027-09-30', totalQty: 1000, branchStock: { BR01: 500, BR02: 200, BR03: 150, BR04: 150 } },
    ],
    fcp: 35,
    marginPct: 25,
  },
  {
    id: 'P-RES-002',
    name: 'Patanjali Dant Kanti 200g',
    sku: 'PDK-200',
    type: 'resale',
    hsn: '33061020',
    dosage: 'Use twice daily for dental hygiene.',
    bmrCode: null,
    vendor: 'Patanjali Ayurved Ltd',
    batches: [
      { batchNo: 'PDK2409', mfgDate: '2024-09-20', expDate: '2027-09-19', totalQty: 700, branchStock: { BR01: 300, BR02: 150, BR03: 100, BR04: 150 } },
    ],
    fcp: 60,
    marginPct: 20,
  },
];

// Sales orders repository
const orders = [];

const taxMaster = {
  // Example GST rates for demonstration
  defaultMedicineGST: 0.12,
  defaultOtherGST: 0.18,
};

function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

function calcSellingPrice(p) {
  const price = p.fcp * (1 + p.marginPct / 100);
  return Math.round(price * 100) / 100;
}

function getNearestBranchByPincode(pincode) {
  if (!pincode || pincode.length < 2) return branches[0];
  const prefix = String(pincode).slice(0, 2);
  const match = branches.find((b) => b.pincodePrefixes.includes(prefix));
  return match || branches[0];
}

function getAvailableQty(productId, branchId) {
  const p = getProductById(productId);
  if (!p) return 0;
  return p.batches.reduce((sum, b) => sum + (b.branchStock[branchId] || 0), 0);
}

function pickFEFOBatch(productId, branchId, qtyNeeded) {
  const p = getProductById(productId);
  if (!p) return null;
  // FEFO: earliest expiry first
  const sorted = [...p.batches].sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  for (const batch of sorted) {
    const available = batch.branchStock[branchId] || 0;
    if (available >= qtyNeeded) return batch;
  }
  return null;
}

export const ERP = {
  async getBranches() {
    await delay(100);
    return branches.map((b) => ({ ...b }));
  },

  async getProducts(filter = {}) {
    await delay(120);
    let list = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      type: p.type,
      hsn: p.hsn,
      vendor: p.vendor,
      dosage: p.dosage,
      bmrCode: p.bmrCode,
      price: calcSellingPrice(p),
    }));
    if (filter.type) list = list.filter((p) => p.type === filter.type);
    return list;
  },

  async getProduct(id) {
    await delay(80);
    const p = getProductById(id);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      type: p.type,
      hsn: p.hsn,
      vendor: p.vendor,
      dosage: p.dosage,
      bmrCode: p.bmrCode,
      batches: p.batches.map((b) => ({
        batchNo: b.batchNo,
        mfgDate: b.mfgDate,
        expDate: b.expDate,
      })),
      price: calcSellingPrice(p),
    };
  },

  async getStock(productId, branchId) {
    await delay(60);
    return getAvailableQty(productId, branchId);
  },

  async getSellingPrice(productId) {
    await delay(40);
    const p = getProductById(productId);
    return p ? calcSellingPrice(p) : null;
  },

  async suggestFulfillment(pincode) {
    await delay(40);
    const branch = getNearestBranchByPincode(pincode);
    return { branchId: branch.id };
  },

  async getTax(productId, deliveryState, fulfillmentState) {
    await delay(40);
    const p = getProductById(productId);
    if (!p) return { rate: 0, type: 'none' };
    const base = p.type === 'manufactured' || p.hsn.startsWith('3004') ? taxMaster.defaultMedicineGST : taxMaster.defaultOtherGST;
    const intra = deliveryState === fulfillmentState;
    return { rate: base, type: intra ? 'CGST+SGST' : 'IGST' };
  },

  async createSalesOrder({ customer, address, items, payment, mode }) {
    // mode: 'delivery' | 'pickup'; if pickup, address may be minimal
    // items: [{ productId, qty }]
    await delay(200);

    // Determine fulfillment per item
    const pin = address?.pincode ? String(address.pincode) : '';
    const suggested = getNearestBranchByPincode(pin);
    const fulfillmentBranch = mode === 'pickup' && customer?.pickupBranchId ? branches.find(b => b.id === customer.pickupBranchId) || suggested : suggested;

    // Allocate FEFO batches and compute totals
    const allocated = [];
    let subTotal = 0;
    let taxTotal = 0;

    for (const it of items) {
      const p = getProductById(it.productId);
      if (!p) throw new Error('Product not found');
      const price = calcSellingPrice(p);
      const batch = pickFEFOBatch(it.productId, fulfillmentBranch.id, it.qty);
      if (!batch) throw new Error(`Insufficient stock for ${p.name} at ${fulfillmentBranch.name}`);
      // Deduct stock
      batch.branchStock[fulfillmentBranch.id] -= it.qty;

      const tax = await this.getTax(it.productId, address?.state || fulfillmentBranch.state, fulfillmentBranch.state);
      const lineAmount = price * it.qty;
      const lineTax = lineAmount * tax.rate;

      subTotal += lineAmount;
      taxTotal += lineTax;

      allocated.push({
        productId: p.id,
        name: p.name,
        qty: it.qty,
        unitPrice: price,
        batchNo: batch.batchNo,
        expDate: batch.expDate,
        taxRate: tax.rate,
        taxType: tax.type,
        fulfillmentBranchId: fulfillmentBranch.id,
      });
    }

    const orderTotal = Math.round((subTotal + taxTotal) * 100) / 100;
    const orderId = `SO-${String(orders.length + 1).padStart(5, '0')}`;

    const order = {
      orderId,
      customer,
      address,
      items: allocated,
      payment,
      mode,
      fulfillmentBranchId: fulfillmentBranch.id,
      subTotal: Math.round(subTotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      orderTotal,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },

  async getOrders() {
    await delay(50);
    return orders.map((o) => ({ ...o }));
  },
};
