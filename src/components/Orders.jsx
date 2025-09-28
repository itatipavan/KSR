import { useEffect, useState } from 'react';
import { Card, List } from 'antd';
import { ERP } from '../services/erp.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => setOrders(await ERP.getOrders()))();
  }, []);

  return (
    <Card title="Your Orders">
      <List
        dataSource={orders}
        renderItem={(o) => (
          <List.Item>
            <List.Item.Meta title={`${o.orderId} — ${new Date(o.createdAt).toLocaleString()}`} description={`Mode: ${o.mode} • Branch: ${o.fulfillmentBranchId}`} />
            <div>₹ {o.orderTotal.toFixed(2)}</div>
          </List.Item>
        )}
      />
    </Card>
  );
}
