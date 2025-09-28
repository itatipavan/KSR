import { Card, Table, Button, Modal, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { DB } from '../services/storage.js';
import { useAuth } from '../store/AuthContext.jsx';

export default function Employees() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [tick, setTick] = useState(0);
  const db = DB.get();
  const branches = db.branches;

  const data = db.employees.filter((e) => user.role === 'MANUFACTURER_MAIN' || e.branchId === user.branchId);

  const cols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Role', dataIndex: 'role' },
    { title: 'Branch', dataIndex: 'branchId' },
    { title: 'Salary', dataIndex: 'salary' },
    {
      title: 'Actions',
      render: (_, r) => (
        <>
          <Button onClick={() => onEdit(r)}>Edit</Button>
          <Button danger onClick={() => onDelete(r.id)}>Delete</Button>
        </>
      ),
    },
  ];

  const onCreate = () => { form.resetFields(); setOpen(true); };
  const onEdit = (r) => { form.setFieldsValue(r); setOpen(true); };
  const onDelete = (id) => { DB.set((d) => ({ ...d, employees: d.employees.filter((e) => e.id !== id) })); setTick((t) => t + 1); };
  const onSubmit = () => {
    form.validateFields().then((vals) => {
      DB.set((d) => {
        const existing = d.employees.find((e) => e.id === vals.id);
        const list = existing
          ? d.employees.map((e) => (e.id === vals.id ? { ...existing, ...vals } : e))
          : [...d.employees, { ...vals, id: 'E' + String(d.employees.length + 1) }];
        return { ...d, employees: list };
      });
      setOpen(false); setTick((t) => t + 1);
    });
  };

  return (
    <Card title="Employees" extra={<Button type="primary" onClick={onCreate}>Add Employee</Button>}>
      <Table rowKey="id" dataSource={data} columns={cols} pagination={{ pageSize: 8 }} />
      <Modal title="Employee" open={open} onCancel={() => setOpen(false)} onOk={onSubmit}>
        <Form layout="vertical" form={form}>
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Branch" name="branchId" rules={[{ required: true }]}>
            <Select options={branches.map((b) => ({ value: b.id, label: b.name }))} />
          </Form.Item>
          <Form.Item label="Salary" name="salary" rules={[{ required: true }]}><Input type="number" /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
