import { Card, Table, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { DB } from '../services/storage.js';
import { useAuth } from '../store/AuthContext.jsx';

export default function Payroll() {
  const { user } = useAuth();
  const db = DB.get();
  const data = db.payrolls.filter((p) => user.role === 'MANUFACTURER_MAIN' || p.branchId === user.branchId);

  const runPayrun = async (month) => {
    const m = month.startOf('month').format('YYYY-MM');
    DB.set((d) => {
      const employees = d.employees.filter((e) => user.role === 'MANUFACTURER_MAIN' || e.branchId === user.branchId);
      const lines = employees.map((e) => ({ empId: e.id, empName: e.name, salary: e.salary }));
      const rec = { id: 'PR' + String(d.payrolls.length + 1), month: m, branchId: user.branchId, lines, total: lines.reduce((s, l) => s + Number(l.salary), 0) };
      return { ...d, payrolls: [...d.payrolls, rec] };
    });
    message.success('Payrun generated');
    window.location.reload();
  };

  return (
    <Card title="Payroll">
      <div className="payroll-actions">
        <DatePicker picker="month" onChange={(v) => v && runPayrun(dayjs(v))} />
      </div>
      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'Payrun', dataIndex: 'id' },
          { title: 'Month', dataIndex: 'month' },
          { title: 'Branch', dataIndex: 'branchId' },
          { title: 'Total', dataIndex: 'total' },
        ]}
      />
    </Card>
  );
}
