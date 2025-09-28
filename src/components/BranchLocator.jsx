import { useEffect, useState } from 'react';
import { ERP } from '../services/erp.js';
import { Card, List, Button } from 'antd';
import { useCart } from '../store/CartContext.jsx';

export default function BranchLocator() {
  const [branches, setBranches] = useState([]);
  const { setPickupBranchId } = useCart();

  useEffect(() => {
    (async () => setBranches(await ERP.getBranches()))();
  }, []);

  return (
    <Card title="Store Locator">
      <List
        itemLayout="vertical"
        dataSource={branches}
        renderItem={(b) => (
          <List.Item key={b.id} extra={<Button onClick={() => { setPickupBranchId(b.id); window.location.hash = '#/checkout'; }}>Pick up here</Button>}>
            <List.Item.Meta
              title={`${b.name} — ${b.city}, ${b.state}`}
              description={b.address}
            />
            <div className="locator-actions">
              <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address + ', ' + b.city)}`}>Open in Google Maps</a>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
