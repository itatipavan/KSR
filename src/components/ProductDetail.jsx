import { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button } from 'antd';
import { ERP } from '../services/erp.js';
import { useCart } from '../store/CartContext.jsx';

export default function ProductDetail({ id }) {
  const [data, setData] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const p = await ERP.getProduct(id);
      if (mounted) setData(p);
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!data) return <div className="loading-note">Loading...</div>;

  return (
    <Card title={data.name} extra={<Tag color={data.type === 'manufactured' ? 'green' : 'blue'}>{data.type}</Tag>}>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="SKU">{data.sku}</Descriptions.Item>
        <Descriptions.Item label="HSN">{data.hsn}</Descriptions.Item>
        {data.vendor && <Descriptions.Item label="Vendor">{data.vendor}</Descriptions.Item>}
        <Descriptions.Item label="Dosage / Usage">{data.dosage}</Descriptions.Item>
        {data.type === 'manufactured' && (
          <Descriptions.Item label="Batch Traceability">
            Linked to BMR: {data.bmrCode}. Specific batch and expiry are assigned per order using FEFO and shown in order confirmation.
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Selling Price">₹ {data.price.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="Compliance">GMP & AYUSH guidelines followed. Batch tracking and expiry controls enforced.</Descriptions.Item>
      </Descriptions>
      <div className="detail-actions">
        <Button type="primary" onClick={() => addItem(data.id, 1)}>Add to Cart</Button>
        <Button onClick={() => (window.location.hash = '#/cart')}>Go to Cart</Button>
      </div>
    </Card>
  );
}
