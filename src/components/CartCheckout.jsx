import { useEffect, useMemo, useState } from 'react';
import { Card, List, InputNumber, Button, Radio, Form, Input, Select, Divider, Result } from 'antd';
import { useCart } from '../store/CartContext.jsx';
import { ERP } from '../services/erp.js';

export function CartPage() {
  const { items, updateQty, removeItem } = useCart();
  const [products, setProducts] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const all = await ERP.getProducts();
      if (!mounted) return;
      const map = Object.fromEntries(all.map((p) => [p.id, p]));
      setProducts(map);
    })();
    return () => { mounted = false; };
  }, []);

  const itemList = items.map((i) => ({ ...i, ...products[i.productId] }));

  const sub = useMemo(() => itemList.reduce((s, i) => s + (i?.price || 0) * i.qty, 0), [itemList]);

  return (
    <Card title="Your Cart">
      <List
        dataSource={itemList}
        renderItem={(it) => (
          <List.Item
            key={it.productId}
            actions={[
              <InputNumber min={1} value={it.qty} onChange={(v) => updateQty(it.productId, Number(v))} />, 
              <Button danger onClick={() => removeItem(it.productId)}>Remove</Button>
            ]}
          >
            <List.Item.Meta title={it?.name || it.productId} description={`₹ ${(it?.price || 0).toFixed(2)}`} />
          </List.Item>
        )}
      />
      <Divider />
      <div className="cart-summary">Subtotal: ₹ {sub.toFixed(2)}</div>
      <div className="cart-actions">
        <Button type="primary" disabled={items.length === 0} onClick={() => (window.location.hash = '#/checkout')}>Checkout</Button>
      </div>
    </Card>
  );
}

export function CheckoutPage() {
  const { items, clear, mode, setMode, pickupBranchId, setPickupBranchId, address, setAddress } = useCart();
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    (async () => setBranches(await ERP.getBranches()))();
  }, []);

  const onFinish = async (values) => {
    setPlacing(true);
    try {
      const payment = values.payment === 'cod' ? { method: 'COD', status: 'Pending' } : { method: 'Online', status: 'Paid' };
      const order = await ERP.createSalesOrder({
        customer: { name: values.name, phone: values.phone, pickupBranchId: values.pickupBranchId || pickupBranchId },
        address: mode === 'delivery' ? { line1: values.address, city: values.city, state: values.state, pincode: values.pincode } : null,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        payment,
        mode,
      });
      setOrder(order);
      clear();
    } catch (e) {
      alert(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !order) return <Result status="info" title="Your cart is empty" extra={<Button onClick={() => (window.location.hash = '#/catalog')}>Browse Products</Button>} />;
  if (order) return <OrderConfirmation order={order} />;

  return (
    <Card title="Checkout">
      <Form layout="vertical" initialValues={{ ...address, mode, payment: 'cod', pickupBranchId }} onFinish={onFinish} onValuesChange={(_, all) => {
        setMode(all.mode);
        setPickupBranchId(all.pickupBranchId || null);
        setAddress({ name: all.name, phone: all.phone, line1: all.address, city: all.city, state: all.state, pincode: all.pincode });
      }}>
        <Form.Item label="Fulfillment" name="mode">
          <Radio.Group>
            <Radio.Button value="delivery">Deliver to address</Radio.Button>
            <Radio.Button value="pickup">Click & Collect</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {mode === 'delivery' ? (
          <>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="State" name="state" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'Telangana', label: 'Telangana' },
                  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </>
        ) : (
          <Form.Item label="Pickup Branch" name="pickupBranchId" rules={[{ required: true, message: 'Select a branch' }]}>
            <Select options={branches.map((b) => ({ value: b.id, label: `${b.name} — ${b.city}` }))} />
          </Form.Item>
        )}

        <Divider />
        <Form.Item label="Payment" name="payment">
          <Radio.Group>
            <Radio value="cod">Cash on Delivery / Pay at Store</Radio>
            <Radio value="online">Online (Simulated)</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider />
        <Button type="primary" htmlType="submit" loading={placing}>Place Order</Button>
      </Form>
    </Card>
  );
}

function OrderConfirmation({ order }) {
  return (
    <Card title={`Order Placed — ${order.orderId}`}>
      <p>Thank you. Your order has been received.</p>
      <p>Fulfillment Branch: {order.fulfillmentBranchId}</p>
      <Divider />
      <List
        header={<div>Items</div>}
        dataSource={order.items}
        renderItem={(it) => (
          <List.Item>
            <List.Item.Meta title={`${it.name} × ${it.qty}`} description={`Batch: ${it.batchNo} • Exp: ${it.expDate}`} />
            <div>₹ {(it.unitPrice * it.qty).toFixed(2)}</div>
          </List.Item>
        )}
      />
      <Divider />
      <div>Subtotal: ₹ {order.subTotal.toFixed(2)}</div>
      <div>Tax: ₹ {order.taxTotal.toFixed(2)}</div>
      <div>Total: ₹ {order.orderTotal.toFixed(2)}</div>
      <Divider />
      <Button onClick={() => (window.location.hash = '#/orders')}>View Orders</Button>
      <Button type="primary" onClick={() => (window.location.hash = '#/catalog')}>Continue Shopping</Button>
    </Card>
  );
}
