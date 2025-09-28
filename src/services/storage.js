const KEY = 'ah_local_db_v1';

const seed = {
  users: [
    { id: 'U1', email: 'admin@ah.com', password: 'admin123', name: 'Main Admin', role: 'MANUFACTURER_MAIN', branchId: 'BR01' },
    { id: 'U2', email: 'br02@ah.com', password: 'branch123', name: 'Branch Manager BR02', role: 'BRANCH_ADMIN', branchId: 'BR02' },
    { id: 'U3', email: 'hr@ah.com', password: 'hr123', name: 'HR Executive', role: 'HR', branchId: 'BR01' },
  ],
  branches: [
    { id: 'BR01', name: 'Main Warehouse' },
    { id: 'BR02', name: 'Jubilee Hills Branch' },
    { id: 'BR03', name: 'Banjara Hills Branch' },
    { id: 'BR04', name: 'Vijayawada Branch' },
  ],
  employees: [
    { id: 'E1', name: 'Ramesh', role: 'Store Executive', branchId: 'BR02', salary: 22000 },
    { id: 'E2', name: 'Sita', role: 'Sales Associate', branchId: 'BR03', salary: 18000 },
  ],
  payrolls: [],
  vendors: [
    { id: 'V1', name: 'Patanjali Ayurved Ltd', contact: 'patanjali@example.com' },
    { id: 'V2', name: 'Emami Ltd (Zandu)', contact: 'zandu@example.com' },
    { id: 'V3', name: 'Heritage Foods', contact: 'heritage@example.com' },
  ],
  purchaseOrders: [],
  invoices: [],
  session: { userId: null },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  }
}

function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const DB = {
  get() { return load(); },
  set(mutator) {
    const db = load();
    const next = mutator ? mutator(db) || db : db;
    save(next);
    return next;
  },
  reset() { save(seed); },
};
