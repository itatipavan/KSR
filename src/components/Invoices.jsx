import { Card, Table } from 'antd';
import { DB } from '../services/storage.js';
import { useAuth } from '../store/AuthContext.jsx';

export default function Invoices() {
  const { user } = useAuth();
  const db = DB.get();
  const data = db.invoices.filter((i) => user.role === 'MANUFACTURER_MAIN' || i.branchId === user.branchId);

  return (
    <Card title="Invoices">
      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'Invoice', dataIndex: 'id' },
          { title: 'Branch', dataIndex: 'branchId' },
          { title: 'Created', dataIndex: 'createdAt' },
          { title: 'Subtotal', dataIndex: 'subTotal' },
          { title: 'Tax', dataIndex: 'tax' },
          { title: 'Total', dataIndex: 'total' },
        ]}
      />
    </Card>
  );
}
