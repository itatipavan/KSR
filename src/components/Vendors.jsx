import { Card, Table, Button, Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { DB } from '../services/storage.js';
import { useAuth } from '../store/AuthContext.jsx';

export default function Vendors() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [tick, setTick] = useState(0);
  const db = DB.get();
  const vendors = db.vendors;

  const cols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Contact', dataIndex: 'contact' },
    { title: 'Actions', render: (_, r) => (<Button onClick={() => createPO(r)}>Create PO</Button>) },
  ];

  const createPO = (vendor) => {
    DB.set((d) => {
      const po = { id: 'PO' + String(d.purchaseOrders.length + 1), vendorId: vendor.id, vendorName: vendor.name, branchId: user.branchId, createdAt: new Date().toISOString(), status: 'Created' };
      return { ...d, purchaseOrders: [po, ...d.purchaseOrders] };
    });
    setTick((t) => t + 1);
  };

  const addVendor = () => { form.resetFields(); setOpen(true); };
  const onSubmit = () => {
    form.validateFields().then((vals) => {
      DB.set((d) => ({ ...d, vendors: [...d.vendors, { id: 'V' + String(d.vendors.length + 1), ...vals }] }));
      setOpen(false); setTick((t) => t + 1);
    });
  };

  return (
    <Card title="Vendors" extra={<Button type="primary" onClick={addVendor}>Add Vendor</Button>}>
      <Table rowKey="id" dataSource={vendors} columns={cols} pagination={{ pageSize: 8 }} />
      <Modal title="Vendor" open={open} onCancel={() => setOpen(false)} onOk={onSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="contact" label="Contact"><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
