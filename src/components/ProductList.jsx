import { useEffect, useMemo, useState } from 'react';
import { Card, Col, Input, Row, Tag, Button, Select } from 'antd';
import { ERP } from '../services/erp.js';
import { useCart } from '../store/CartContext.jsx';

export default function ProductList({ type }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const list = await ERP.getProducts(type ? { type } : {});
      const brs = await ERP.getBranches();
      if (!mounted) return;
      setData(list);
      setBranches(brs);
      setBranchId(brs[0]?.id || '');
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [type]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <div className="catalog-section">
      <div className="catalog-toolbar">
        <Input.Search placeholder="Search products" onSearch={setQuery} onChange={(e) => setQuery(e.target.value)} allowClear />
        <div className="branch-select">
          <span>Check stock at:</span>
          <Select
            value={branchId}
            onChange={setBranchId}
            options={branches.map((b) => ({ value: b.id, label: `${b.name} (${b.city})` }))}
            style={{ minWidth: 220 }}
          />
        </div>
      </div>
      <Row gutter={[16, 16]}>
        {filtered.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={p} branchId={branchId} onAdd={() => addItem(p.id, 1)} />
          </Col>
        ))}
      </Row>
      {loading && <div className="loading-note">Loading...</div>}
      {!loading && filtered.length === 0 && <div className="empty-note">No products found.</div>}
    </div>
  );
}

function ProductCard({ product, branchId, onAdd }) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const qty = await ERP.getStock(product.id, branchId);
      if (mounted) setStock(qty);
    })();
    return () => { mounted = false; };
  }, [product.id, branchId]);

  return (
    <Card title={product.name} extra={<Tag color={product.type === 'manufactured' ? 'green' : 'blue'}>{product.type}</Tag>}>
      <div className="product-sku">SKU: {product.sku}</div>
      {product.vendor && <div className="product-vendor">Vendor: {product.vendor}</div>}
      <div className="product-price">₹ {product.price.toFixed(2)}</div>
      <div className="product-stock">Stock at selected branch: {stock}</div>
      <div className="card-actions">
        <Button type="primary" disabled={stock <= 0} onClick={onAdd}>Add to Cart</Button>
        <Button onClick={() => (window.location.hash = `#/product/${product.id}`)}>View</Button>
      </div>
    </Card>
  );
}
