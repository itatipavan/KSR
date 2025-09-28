import { useEffect, useMemo, useState } from 'react';
import { Card, Input, List, Button, InputNumber, Divider, message } from 'antd';
import { ERP } from '../services/erp.js';
import { DB } from '../services/storage.js';
import { useAuth } from '../store/AuthContext.jsx';

export default function POS() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // {id, name, price, qty}

  useEffect(() => { (async () => setProducts(await ERP.getProducts()))(); }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t));
  }, [q, products]);

  const add = (p) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) { const cp = [...prev]; cp[i] = { ...cp[i], qty: cp[i].qty + 1 }; return cp; }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const setQty = (id, qty) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty } : x)));
  const remove = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

  const sub = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const tax = Math.round(sub * 0.12 * 100) / 100; // simple demo tax
  const total = Math.round((sub + tax) * 100) / 100;

  const generateInvoice = () => {
    if (cart.length === 0) return message.warning('Add items');
    DB.set((d) => {
      const id = 'INV-' + String(d.invoices.length + 1).padStart(5, '0');
      const inv = {
        id,
        branchId: user.branchId,
        userId: user.id,
        items: cart.map((c) => ({ productId: c.id, name: c.name, qty: c.qty, price: c.price })),
        subTotal: Math.round(sub * 100) / 100,
        tax,
        total,
        createdAt: new Date().toISOString(),
      };
      return { ...d, invoices: [inv, ...d.invoices] };
    });
    message.success('Invoice generated');
    setCart([]);
  };

  return (
    <div className="pos-section">
      <Card title="Billing (POS)">
        <div className="pos-toolbar">
          <Input placeholder="Search products or scan SKU" value={q} onChange={(e) => setQ(e.target.value)} allowClear />
        </div>
        <div className="pos-grid">
          <div className="pos-products">
            <List
              size="small"
              dataSource={list}
              renderItem={(p) => (
                <List.Item actions={[<Button type="link" onClick={() => add(p)}>Add</Button>] }>
                  <List.Item.Meta title={p.name} description={`₹ ${p.price.toFixed(2)} • ${p.sku}`} />
                </List.Item>
              )}
            />
          </div>
          <div className="pos-cart">
            <List
              size="small"
              header={<div>Selected Items</div>}
              dataSource={cart}
              renderItem={(c) => (
                <List.Item actions={[<InputNumber min={1} value={c.qty} onChange={(v) => setQty(c.id, Number(v))} />, <Button danger onClick={() => remove(c.id)}>Remove</Button>] }>
                  <List.Item.Meta title={c.name} description={`₹ ${c.price.toFixed(2)}`} />
                  <div>₹ {(c.price * c.qty).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <Divider />
            <div>Subtotal: ₹ {sub.toFixed(2)}</div>
            <div>Tax: ₹ {tax.toFixed(2)}</div>
            <div>Total: ₹ {total.toFixed(2)}</div>
            <Divider />
            <Button type="primary" onClick={generateInvoice}>Generate Invoice</Button>
            <Button onClick={() => (window.location.hash = '#/invoices')}>View Invoices</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
